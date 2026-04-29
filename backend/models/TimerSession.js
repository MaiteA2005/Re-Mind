import mongoose from "mongoose";

const timerSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["workday", "focus", "break"],
      required: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
    },

    elapsedSeconds: {
      type: Number,
      default: 0,
    },

    pauseSeconds: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TimerSession", timerSessionSchema);