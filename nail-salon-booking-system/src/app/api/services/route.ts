import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Service from "@/models/Service";

const initialServices = [
  {
    name: "Manicure & Pedicure",
    description: "Enjoy a professional manicure and pedicure experience.",
    price: 25,
    duration: 60,
    image: "/images/nail-service.jpg",
  },
  {
    name: "Nail Art",
    description: "Beautiful and creative nail designs tailored to your taste.",
    price: 30,
    duration: 45,
    image: "/images/nail-service4.jpg",
  },
  {
    name: "Acrylic Nails",
    description: "Strong and stylish acrylic nails customized for you.",
    price: 40,
    duration: 90,
    image: "/images/nail-service3.jpg",
  },
  {
    name: "Gel Nails",
    description: "Long-lasting gel nails with a glossy finish.",
    price: 35,
    duration: 75,
    image: "/images/nail-service2.jpg",
  }
];

// ----- GET handler -----
export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({});

    if (services.length === 0) {
      await Service.insertMany(initialServices);
      return NextResponse.json(initialServices, { status: 201 });
    }

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
  }
}

// ----- POST handler -----
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const { name, description, price, duration, image } = body;

    if (!name || !description || !price || !duration) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newService = await Service.create({ name, description, price, duration, image });

    return NextResponse.json({ message: "Service added", service: newService }, { status: 201 });
  } catch (error) {
  if (error instanceof Error) {
    return NextResponse.json({ message: "Error adding service", error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}