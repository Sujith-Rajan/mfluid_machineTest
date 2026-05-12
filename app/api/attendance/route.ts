import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const attendanceRecords = await Attendance.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(attendanceRecords);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch attendance", error: error.message }, { status: 500 });
  }
}
