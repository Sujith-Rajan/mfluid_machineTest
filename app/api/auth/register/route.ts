import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { fullName, email, password, confirmPassword, phone, profilePicture } = await req.json();

    // 1. Validation
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    if (!email || !fullName || !password || !phone) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json({ message: "Phone number must be exactly 10 digits" }, { status: 400 });
    }

    // 2. Connect to MongoDB
    await connectToDatabase();

    // 3. Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create and Save User to Database
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      profilePicture,
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Database Save Error:", error);
    return NextResponse.json(
      { message: "Failed to save user to database", error: error.message },
      { status: 500 }
    );
  }
}
