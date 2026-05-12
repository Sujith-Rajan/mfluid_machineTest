import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Timesheet from "@/models/Timesheet";

export async function GET() {
  try {
    await connectToDatabase();
    const timesheets = await Timesheet.find({}).sort({ date: -1 });
    return NextResponse.json(timesheets);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch timesheets", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { date, hours, task, description } = await req.json();

    if (!date || !hours || !task) {
      return NextResponse.json({ message: "Date, hours, and task are required" }, { status: 400 });
    }

    await connectToDatabase();

    const newTimesheet = new Timesheet({
      date,
      hours,
      task,
      description,
    });

    await newTimesheet.save();

    return NextResponse.json({ message: "Timesheet entry created", timesheet: newTimesheet }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to create timesheet", error: error.message }, { status: 500 });
  }
}
