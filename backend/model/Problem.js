const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    statement: {
      type: String,
      required: [true, "Problem statement is required"],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: [true, "Difficulty is required"],
    },
    timeLimit: {
      type: Number,
      required: [true, "Time limit is required"],
      default: 2, // 2 seconds
    },
    memoryLimit: {
      type: Number,
      required: [true, "Memory limit is required"],
      default: 256, // 256 MB
    },
    inputFormat: {
      type: String,
      required: [true, "Input format is required"],
    },
    outputFormat: {
      type: String,
      required: [true, "Output format is required"],
    },
    sampleInput: {
      type: String,
      required: [true, "Sample input is required"],
    },
    sampleOutput: {
      type: String,
      required: [true, "Sample output is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
