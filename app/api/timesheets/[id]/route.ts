import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Timesheet from "@/models/Timesheet";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { date, hours, task, description, status } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updatedTimesheet = await Timesheet.findByIdAndUpdate(
      id,
      { date, hours, task, description, status },
      { new: true, runValidators: true }
    );

    if (!updatedTimesheet) {
      return NextResponse.json({ message: "Timesheet not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Timesheet updated", timesheet: updatedTimesheet });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update timesheet", error: error.message }, { status: 500 });
  }
}
