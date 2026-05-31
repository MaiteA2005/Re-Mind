import mongoose from "mongoose";

const focusTaskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        text: {
            type: String,
            required: true,
            trim: true,
        },

        day: {
            type: String,
            enum: ["today", "tomorrow"],
            required: true,
        },

        done: {
            type: Boolean,
            default: false,
        },

        source: {
            type: String,
            enum: ["manual", "dayClosing"],
            default: "manual",
        },
        },    
    { timestamps: true }
);

export default mongoose.model("FocusTask", focusTaskSchema);