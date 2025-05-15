import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import User from "@/models/User";
import dbConnect from "@/app/lib/dbConnect";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key_here";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    const normalizedEmail = email.toLowerCase();
    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email.toLowerCase(), role: user.role, name: user.name, phone: user.phone },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    

    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    console.log("Login User ID:", user._id.toString()); // Debug
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          _id: user._id.toString(), // Ensure _id is a string
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}