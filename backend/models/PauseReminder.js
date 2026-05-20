import mongoose from "mongoose";

const pauseReminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: ["taken", "snoozed", "missed"],
      required: true,
    },

    reminderInterval: {
      type: Number,
      required: true,
    },

    workdayElapsedSeconds: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PauseReminder", pauseReminderSchema);