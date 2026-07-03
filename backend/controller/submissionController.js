const Submission = require("../model/Submission");
const Problem = require("../model/Problem");
const JudgeJob = require("../model/JudgeJob");
const { enqueueJudgeJob } = require("../queue/judgeQueue");

const createSubmission = async (req, res, next) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: "problemId, language, and code are required",
      });
    }

    const problem = await Problem.findById(problemId).select("_id");
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const submission = await Submission.create({
      userId: req.user.id,
      problemId,
      language,
      code,
      verdict: "Pending",
    });

    const judgeJob = await JudgeJob.create({
      submissionId: submission._id,
    });

    try {
      await enqueueJudgeJob(judgeJob._id, submission._id);
    } catch (queueError) {
      await JudgeJob.findByIdAndUpdate(judgeJob._id, {
        error: `Failed to publish to RabbitMQ: ${queueError.message}`,
      });
      console.error("Failed to enqueue judge job:", queueError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Submission queued for judging",
      submission,
      judgeJob,
    });
  } catch (error) {
    next(error);
  }
};

const getUserSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .populate("problemId", "title difficulty")
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Submissions retrieved successfully",
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findOne({
      _id: id,
      userId: req.user.id,
    }).populate("problemId", "title difficulty");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission retrieved successfully",
      submission,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubmission,
  getUserSubmissions,
  getSubmissionById,
};
