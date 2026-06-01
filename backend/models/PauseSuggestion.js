import mongoose from "mongoose";

const breathingPatternSchema = new mongoose.Schema(
  {
    inhale: Number,
    secondInhale: Number,
    holdAfterInhale: Number,
    exhale: Number,
    holdAfterExhale: Number,
  },
  { _id: false }
);

const methodOptionSchema = new mongoose.Schema(
  {
    label: String,
    inhale: Number,
    secondInhale: Number,
    holdAfterInhale: Number,
    exhale: Number,
    holdAfterExhale: Number,
  },
  { _id: false }
);

const pauseSuggestionSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      required: true,
    },

    category: {
      type: String,
    },

    title: {
      type: String,
      required: true,
    },

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

    isCategory: {
      type: Boolean,
      default: false,
    },

    breathingPattern: breathingPatternSchema,
    methodOptions: [methodOptionSchema],
  },
  { timestamps: true }
);


export default mongoose.model("PauseSuggestion", pauseSuggestionSchema);