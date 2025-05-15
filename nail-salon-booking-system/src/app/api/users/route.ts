import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}, "_id email"); // Fetch only _id and email

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
