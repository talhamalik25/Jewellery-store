import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { getCartUserId } from "@/lib/cart-auth";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function PATCH(request, { params }) {
  const auth = await getCartUserId();
  if (auth.error) return auth.error;

  const { productId } = await params;
  if (!mongoose.isObjectIdOrHexString(productId)) {
    return Response.json({ error: "A valid productId is required." }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must contain valid JSON." }, { status: 400 });
  }

  const quantity = body?.quantity === undefined ? NaN : Number(body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) {
    return Response.json({ error: "Quantity must be an integer of at least 1." }, { status: 400 });
  }

  try {
    await connectDB();

    const [product, cart] = await Promise.all([
      Product.findById(productId),
      Cart.findOne({ user: auth.userId }),
    ]);
    if (!product) return Response.json({ error: "Product not found." }, { status: 404 });
    if (!cart) return Response.json({ error: "Cart not found." }, { status: 404 });

    const item = cart.items.find((entry) => entry.product.toString() === productId);
    if (!item) return Response.json({ error: "Product is not in the cart." }, { status: 404 });

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    return Response.json({ cart });
  } catch (error) {
    console.error("Failed to update cart item:", error);
    return Response.json({ error: "Unable to update cart." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const auth = await getCartUserId();
  if (auth.error) return auth.error;

  const { productId } = await params;
  if (!mongoose.isObjectIdOrHexString(productId)) {
    return Response.json({ error: "A valid productId is required." }, { status: 400 });
  }

  try {
    await connectDB();

    const cart = await Cart.findOne({ user: auth.userId });
    if (!cart) return Response.json({ error: "Cart not found." }, { status: 404 });

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex === -1) return Response.json({ error: "Product is not in the cart." }, { status: 404 });

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate("items.product");

    return Response.json({ cart });
  } catch (error) {
    console.error("Failed to remove cart item:", error);
    return Response.json({ error: "Unable to update cart." }, { status: 500 });
  }
}
