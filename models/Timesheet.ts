import mongoose, { Schema, model, models } from "mongoose";

const TimesheetSchema = new Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    hours: {
      type: Number,
      required: [true, "Hours are required"],
      min: [0, "Hours cannot be negative"],
      max: [24, "Hours cannot exceed 24"],
    },
    task: {
      type: String,
      required: [true, "Task name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Timesheet = models.Timesheet || model("Timesheet", TimesheetSchema);

export default Timesheet;
