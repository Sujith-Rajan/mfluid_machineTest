import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const today = new Date().toISOString().split("T")[0];

    // Check if already checked in today and not checked out
    const existingEntry = await Attendance.findOne({
      userId,
      date: today,
      checkOut: { $exists: false },
    });

    if (existingEntry) {
      return NextResponse.json(
        { message: "You are already checked in" },
        { status: 400 }
      );
    }

    const newAttendance = new Attendance({
      userId,
      date: today,
      checkIn: new Date(),
    });

    await newAttendance.save();

    return NextResponse.json(
      { message: "Checked in successfully", attendance: newAttendance },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Check-in failed", error: error.message },
      { status: 500 }
    );
  }
}
