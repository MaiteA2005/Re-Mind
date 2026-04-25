import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    workSituation: {
      type: String,
      default: "",
    },

    workload: {
      type: String,
      default: "",
    },

    goals: {
      type: [String],
      default: [],
    },

    notificationsEnabled: {
      type: Boolean,
      default: false,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);