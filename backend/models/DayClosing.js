import mongoose from "mongoose";

const dayClosingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dayFeeling: {
      type: String,
      required: true,
    },

    highlight: {
      type: String,
      default: "",
    },

    challenge: {
      type: String,
      default: "",
    },

    energyAfterWork: {
      type: String,
      required: true,
    },

    gratitude: {
      type: String,
      default: "",
    },

    tomorrowFocus: {
      type: String,
      default: "",
    },

    focusCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DayClosing", dayClosingSchema);