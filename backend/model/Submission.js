const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: [true, "User reference is required"],
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: [true, "Problem reference is required"],
    },
    language: {
      type: String,
      enum: ["c", "cpp", "java", "python", "javascript"],
      required: [true, "Language is required"],
    },
    code: {
      type: String,
      required: [true, "Source code is required"],
    },
    verdict: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Runtime Error",
        "Compilation Error",
        "Pending",
      ],
      default: "Pending",
    },
    executionTime: {
      type: Number,
      default: 0, // in ms
    },
    memoryUsed: {
      type: Number,
      default: 0, // in MB
    },
    testcasesPassed: {
      type: Number,
      default: 0,
    },
    totalTestcases: {
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
