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

    // Find the active check-in session for today for this specific user
    const activeEntry = await Attendance.findOne({
      userId,
      date: today,
      checkOut: { $exists: false },
    }).sort({ createdAt: -1 });

    if (!activeEntry) {
      return NextResponse.json(
        { message: "No active check-in found for today" },
        { status: 400 }
      );
    }

    activeEntry.checkOut = new Date();
    await activeEntry.save();

    return NextResponse.json(
      { message: "Checked out successfully", attendance: activeEntry },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Check-out failed", error: error.message },
      { status: 500 }
    );
  }
}
