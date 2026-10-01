import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Product from "@/models/Product";

async function getId(params) {
  const { id } = await params;
  return id;
}

function invalidIdResponse() {
  return Response.json({ error: "Invalid product ID." }, { status: 400 });
}

export async function GET(_request, { params }) {
  const id = await getId(params);

  if (!mongoose.isObjectIdOrHexString(id)) {
    return invalidIdResponse();
  }

  try {
    await connectDB();

    const product = await Product.findById(id);

    if (!product) {
      return Response.json({ error: "Product not found." }, { status: 404 });
    }

    return Response.json(product, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve product:", error);
    return Response.json({ error: "Unable to retrieve product." }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = await getId(params);

  if (!mongoose.isObjectIdOrHexString(id)) {
    return invalidIdResponse();
  }

  let updates;
  try {
    updates = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must contain valid JSON." },
      { status: 400 }
    );
  }

  if (!updates || Array.isArray(updates) || typeof updates !== "object") {
    return Response.json(
      { error: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return Response.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return Response.json(product, { status: 200 });
  } catch (error) {
    if (error.name === "ValidationError") {
      const details = Object.values(error.errors).map(
        (validationError) => validationError.message
      );

      return Response.json(
        { error: "Product validation failed.", details },
        { status: 400 }
      );
    }

    console.error("Failed to update product:", error);

    return Response.json(
      { error: "Unable to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = await getId(params);

  if (!mongoose.isObjectIdOrHexString(id)) {
    return invalidIdResponse();
  }

  try {
    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return Response.json({ error: "Product not found." }, { status: 404 });
    }

    return Response.json({ message: "Product deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return Response.json({ error: "Unable to delete product." }, { status: 500 });
  }
}
