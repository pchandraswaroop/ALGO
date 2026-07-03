const mongoose = require("mongoose");

const judgeJobSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: [true, "Submission reference is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"],
      default: "queued",
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    error: {
      type: String,
      default: "",
    },
    queuedAt: {
      type: Date,
      default: Date.now,
    },
    startedAt: {
      type: Date,
    },
    finishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

judgeJobSchema.index({ status: 1, queuedAt: 1 });

const JudgeJob = mongoose.model("JudgeJob", judgeJobSchema);

module.exports = JudgeJob;
