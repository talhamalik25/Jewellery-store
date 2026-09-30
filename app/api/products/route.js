import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find();

    return Response.json(
      {
        success: true,
        message: "MongoDB connection successful.",
        products,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to retrieve products:", error);

    return Response.json(
      {
        success: false,
        error: error.name === "MongoParseError"
          ? "MONGODB_URI must be a valid MongoDB connection string."
          : "Could not connect to MongoDB or retrieve products. Check the URI and database availability.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  let productData;

  try {
    productData = await request.json();
  } catch {
    return Response.json({ error: "Request body must contain valid JSON." }, { status: 400 });
  }

  if (!productData || Array.isArray(productData) || typeof productData !== "object") {
    return Response.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }

  try {
    await connectDB();

    const product = await Product.create(productData);

    return Response.json(product, { status: 201 });
  } catch (error) {
    if (error.name === "ValidationError") {
      const details = Object.values(error.errors).map((validationError) => validationError.message);

      return Response.json(
        { error: "Product validation failed.", details },
        { status: 400 },
      );
    }

    console.error("Failed to create product:", error);

    return Response.json(
      { error: "Unable to create product." },
      { status: 500 },
    );
  }
}
