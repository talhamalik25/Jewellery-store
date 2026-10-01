import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Order from "@/models/Order";

const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    return Response.json({ orders });
  } catch (error) {
    console.error("Failed to retrieve admin orders:", error);
    return Response.json({ error: "Unable to retrieve orders." }, { status: 500 });
  }
}

export async function PATCH(request) {
  const auth = await requireAdmin();
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
  if (typeof body.orderId !== "string" || !mongoose.isObjectIdOrHexString(body.orderId)) {
    return Response.json({ error: "A valid order ID is required." }, { status: 400 });
  }
  if (!validStatuses.includes(body.status)) {
    return Response.json({ error: "A valid order status is required." }, { status: 400 });
  }

  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(body.orderId, { status: body.status }, { new: true, runValidators: true })
      .populate("user", "name email");
    if (!order) return Response.json({ error: "Order not found." }, { status: 404 });
    return Response.json({ order });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return Response.json({ error: "Unable to update order status." }, { status: 500 });
  }
}
