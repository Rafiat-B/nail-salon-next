import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/models/User";

// GET /api/users/[id]
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract user ID from the request URL path (e.g. /api/users/123)
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = segments[segments.length - 1]; // Gets the last segment as ID

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // Extract user ID from URL path
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = segments[segments.length - 1];

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const body = await req.json();
    const user = await User.findByIdAndUpdate(userId, body, { new: true }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
