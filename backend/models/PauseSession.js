import mongoose from "mongoose";

const pauseSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    pauseSlug: {
      type: String,
      required: true,
    },

    pauseTitle: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      default: "",
    },

    completed: {
      type: Boolean,
      default: true,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PauseSession", pauseSessionSchema);