import mongoose from "mongoose";

const businessRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    contact: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    teamSize: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["new", "contacted", "approved", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("BusinessRequest", businessRequestSchema);