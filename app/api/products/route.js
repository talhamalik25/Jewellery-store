import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find();

    return Response.json(products, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve products:", error);

    return Response.json(
      { error: "Unable to retrieve products. Please try again later." },
      { status: 500 },
    );
  }
}
