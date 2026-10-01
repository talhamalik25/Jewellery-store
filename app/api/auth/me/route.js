import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json({ error: "Authentication is required." }, { status: 401 });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured.");
    return Response.json({ error: "Unable to authenticate request." }, { status: 500 });
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    return Response.json({ error: "Authentication token is invalid or expired." }, { status: 401 });
  }

  if (typeof payload !== "object" || typeof payload.userId !== "string" || !mongoose.isObjectIdOrHexString(payload.userId)) {
    return Response.json({ error: "Authentication token is invalid." }, { status: 401 });
  }

  try {
    await connectDB();

    const user = await User.findById(payload.userId);
    if (!user) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    return Response.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve authenticated user:", error);
    return Response.json({ error: "Unable to retrieve user." }, { status: 500 });
  }
}
