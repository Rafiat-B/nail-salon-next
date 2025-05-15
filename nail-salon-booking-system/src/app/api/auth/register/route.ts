import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/app/lib/dbConnect';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, email, password, phone } = await req.json();
        const normalizedEmail = email.toLowerCase();
        // Validate input fields
        if (!name || !email || !password || !phone) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save user
        const newUser = new User({ name, email: normalizedEmail, password: hashedPassword, phone, role: 'customer' });
        await newUser.save();

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
