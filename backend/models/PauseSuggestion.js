import mongoose from "mongoose";

const pauseSuggestionSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    duration: String,
    icon: String,

    instructionTitle: String,
    instructions: [String],

    infoTitle: String,
    infoText: String,

    completeTitle: String,
    completeText: String,

    isCategory: Boolean,

    methods: [
      {
        id: Number,
        slug: String,
        title: String,
        description: String,
        duration: String,
        icon: String,
        rhythm: String,

        instructionTitle: String,
        instructions: [String],

        infoTitle: String,
        infoText: String,

        completeTitle: String,
        completeText: String,

        breathingPattern: Object,
        methodOptions: [Object],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("PauseSuggestion", pauseSuggestionSchema);