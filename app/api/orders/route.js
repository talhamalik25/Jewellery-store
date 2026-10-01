import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { getCartUserId } from "@/lib/cart-auth";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";

function isValidShippingAddress(address) {
  return address && typeof address === "object" && !Array.isArray(address)
    && ["fullName", "phone", "address", "city"].every(
      (field) => typeof address[field] === "string" && address[field].trim().length > 0,
    );
}

export async function GET() {
  const auth = await getCartUserId();
  if (auth.error) return auth.error;

  try {
    await connectDB();

    const orders = await Order.find({ user: auth.userId }).sort({ createdAt: -1 });
    return Response.json({ orders });
  } catch (error) {
    console.error("Failed to retrieve orders:", error);
    return Response.json({ error: "Unable to retrieve orders." }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await getCartUserId();
  if (auth.error) return auth.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must contain valid JSON." }, { status: 400 });
  }

  if (!body || Array.isArray(body) || typeof body !== "object") {
    return Response.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }
  if (!isValidShippingAddress(body.shippingAddress)) {
    return Response.json(
      { error: "Shipping address must include fullName, phone, address, and city." },
      { status: 400 },
    );
  }

  let session;
  try {
    await connectDB();
    session = await mongoose.startSession();

    let createdOrder;
    let checkoutError;

    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: auth.userId }).session(session);
      if (!cart || cart.items.length === 0) {
        checkoutError = { status: 400, message: "Cart is empty." };
        return;
      }

      const quantities = new Map();
      for (const item of cart.items) {
        const productId = item.product.toString();
        quantities.set(productId, (quantities.get(productId) || 0) + item.quantity);
      }

      const productIds = [...quantities.keys()];
      const products = await Product.find({ _id: { $in: productIds } }).session(session);
      const productById = new Map(products.map((product) => [product._id.toString(), product]));

      const orderItems = [];
      let total = 0;

      for (const [productId, quantity] of quantities) {
        const product = productById.get(productId);
        if (!product) {
          checkoutError = { status: 400, message: "A product in the cart no longer exists." };
          return;
        }
        if (quantity > product.stock) {
          checkoutError = { status: 400, message: `Insufficient stock for ${product.name}.` };
          return;
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity,
        });
        total += product.price * quantity;
      }

      for (const [productId, quantity] of quantities) {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: productId, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } },
          { new: true, session },
        );
        if (!updatedProduct) {
          checkoutError = { status: 400, message: "Stock changed during checkout. Please try again." };
          throw new Error("CHECKOUT_STOCK_CHANGED");
        }
      }

      [createdOrder] = await Order.create(
        [{
          user: auth.userId,
          items: orderItems,
          total,
          shippingAddress: {
            fullName: body.shippingAddress.fullName.trim(),
            phone: body.shippingAddress.phone.trim(),
            address: body.shippingAddress.address.trim(),
            city: body.shippingAddress.city.trim(),
          },
        }],
        { session },
      );

      cart.items = [];
      await cart.save({ session });
    });

    if (checkoutError) {
      return Response.json({ error: checkoutError.message }, { status: checkoutError.status });
    }

    return Response.json({ order: createdOrder }, { status: 201 });
  } catch (error) {
    if (error.message === "CHECKOUT_STOCK_CHANGED") {
      return Response.json({ error: "Stock changed during checkout. Please try again." }, { status: 400 });
    }
    console.error("Failed to create order:", error);
    return Response.json({ error: "Unable to create order." }, { status: 500 });
  } finally {
    await session?.endSession();
  }
}
