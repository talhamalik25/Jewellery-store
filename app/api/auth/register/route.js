import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must contain valid JSON." }, { status: 400 });
  }

  if (!body || Array.isArray(body) || typeof body !== "object") {
    return Response.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return Response.json({ error: "Name, email, and password are required." }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (password.length < 6) {
    return Response.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return Response.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return Response.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    if (error.name === "ValidationError") {
      const details = Object.values(error.errors).map((validationError) => validationError.message);
      return Response.json({ error: "User validation failed.", details }, { status: 400 });
    }

    console.error("Failed to register user:", error);
    return Response.json({ error: "Unable to register user." }, { status: 500 });
  }
}
