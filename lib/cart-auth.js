import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getCartUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: Response.json({ error: "Authentication is required." }, { status: 401 }) };
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured.");
    return { error: Response.json({ error: "Unable to authenticate request." }, { status: 500 }) };
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    return { error: Response.json({ error: "Authentication token is invalid or expired." }, { status: 401 }) };
  }

  if (typeof payload !== "object" || typeof payload.userId !== "string" || !mongoose.isObjectIdOrHexString(payload.userId)) {
    return { error: Response.json({ error: "Authentication token is invalid." }, { status: 401 }) };
  }

  return { userId: payload.userId };
}
