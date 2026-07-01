const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: [true, "Problem reference is required"],
    },
    input: {
      type: String,
      required: [true, "Input content is required"],
    },
    expectedOutput: {
      type: String,
      required: [true, "Expected output content is required"],
    },
    isHidden: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const TestCase = mongoose.model("TestCase", testCaseSchema);

module.exports = TestCase;
