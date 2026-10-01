import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { getCartUserId } from "@/lib/cart-auth";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function GET() {
  const auth = await getCartUserId();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    let cart = await Cart.findOne({ user: auth.userId }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: auth.userId, items: [] });
      cart = await Cart.findById(cart._id).populate("items.product");
    }

    return Response.json({ cart });
  } catch (error) {
    console.error("Failed to retrieve cart:", error);
    return Response.json({ error: "Unable to retrieve cart." }, { status: 500 });
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

  const productId = body.productId;
  const quantity = body.quantity === undefined ? 1 : Number(body.quantity);

  if (typeof productId !== "string" || !mongoose.isObjectIdOrHexString(productId)) {
    return Response.json({ error: "A valid productId is required." }, { status: 400 });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return Response.json({ error: "Quantity must be an integer of at least 1." }, { status: 400 });
  }

  try {
    await connectDB();

    const product = await Product.findById(productId);
    if (!product) return Response.json({ error: "Product not found." }, { status: 404 });

    let cart = await Cart.findOne({ user: auth.userId });
    if (!cart) cart = new Cart({ user: auth.userId, items: [] });

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) existingItem.quantity += quantity;
    else cart.items.push({ product: productId, quantity });

    await cart.save();
    await cart.populate("items.product");

    return Response.json({ cart }, { status: 200 });
  } catch (error) {
    console.error("Failed to add product to cart:", error);
    return Response.json({ error: "Unable to update cart." }, { status: 500 });
  }
}
