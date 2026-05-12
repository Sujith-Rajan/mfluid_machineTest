import mongoose, { Schema, model, models } from "mongoose";

const AttendanceSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for this test task
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Attendance = models.Attendance || model("Attendance", AttendanceSchema);

export default Attendance;
