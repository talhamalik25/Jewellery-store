import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { user: null, error: Response.json({ error: "Authentication is required." }, { status: 401 }) };
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured.");
    return { user: null, error: Response.json({ error: "Unable to authenticate request." }, { status: 500 }) };
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    return { user: null, error: Response.json({ error: "Authentication token is invalid or expired." }, { status: 401 }) };
  }

  if (typeof payload !== "object" || typeof payload.userId !== "string" || !mongoose.isObjectIdOrHexString(payload.userId)) {
    return { user: null, error: Response.json({ error: "Authentication token is invalid." }, { status: 401 }) };
  }

  try {
    await connectDB();
    const user = await User.findById(payload.userId);

    if (!user) {
      return { user: null, error: Response.json({ error: "User not found." }, { status: 401 }) };
    }

    return { user, error: null };
  } catch (error) {
    console.error("Failed to retrieve authenticated user:", error);
    return { user: null, error: Response.json({ error: "Unable to retrieve user." }, { status: 500 }) };
  }
}

export async function requireAdmin() {
  const result = await getAuthenticatedUser();

  if (result.error) {
    return { error: result.error };
  }

  if (result.user.role !== "admin") {
    return { error: Response.json({ error: "Admin access is required." }, { status: 403 }) };
  }

  return { user: result.user, error: null };
}
