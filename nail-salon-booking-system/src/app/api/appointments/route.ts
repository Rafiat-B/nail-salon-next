import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Appointment from "@/models/Appointment";

// ✅ GET All Bookings (optionally filter by user_id if passed as query param)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get("user-id");

    console.log("GET Appointments - userId:", userId);

    let appointments;
    if (userId) {
      appointments = await Appointment.find({ user_id: userId });
    } else {
      appointments = await Appointment.find();
    }

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/appointments:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

// ✅ POST Create a Booking
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { user_id, service_id, appointment_date, status } = await req.json();
    if (!user_id || !service_id || !appointment_date) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    console.log("POST Create Booking - Received body:", { user_id, service_id, appointment_date, status });

    if (!user_id || !service_id || !appointment_date) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newBooking = new Appointment({
      user_id,
      service_id,
      appointment_date: new Date(appointment_date),
      status: status || "pending",
    });

    await newBooking.save();

    return NextResponse.json({ message: "Booking created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/appointments:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ PUT Update Booking Status
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { id, status } = await req.json();

    console.log("PUT Update Booking - Received:", { id, status });

    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updatedBooking = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/appointments:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

// ✅ DELETE Booking
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();

    console.log("DELETE Booking - Received ID:", id);

    const deletedBooking = await Appointment.findByIdAndDelete(id);

    if (!deletedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/appointments:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
