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

    workdayStartTime: {
      type: String,
      default: "09:00",
    },

    workdayEndTime: {
      type: String,
      default: "17:00",
    },

    lunchStartTime: {
      type: String,
      default: "12:00",
    },

    lunchDurationMinutes: {
      type: Number,
      default: 30,
    },

    calendarConnected: {
      type: Boolean,
      default: false,
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

    checkInReminders: {
      type: Boolean,
      default: true,
    },

    pauseSuggestionsEnabled: {
      type: Boolean,
      default: true,
    },

    notificationFrequency: {
      type: String,
      default: "Elke 2 uur",
    },

    subscriptionPlan: {
      type: String,
      enum: ["free", "premium", "business"],
      default: "free",
    },

    businessRole: {
      type: String,
      enum: ["none", "admin", "member"],
      default: "none",
    },

    businessName: {
      type: String,
      default: "",
    },

    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },

    favoritePauses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PauseSuggestion",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);