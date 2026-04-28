import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stressLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    energyLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CheckIn", checkInSchema);