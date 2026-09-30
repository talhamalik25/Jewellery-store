import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { connection: null, promise: null };
}

export default async function connectDB() {
  if (cached.connection) return cached.connection;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((instance) => instance);
  }

  try {
    cached.connection = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.connection;
}
