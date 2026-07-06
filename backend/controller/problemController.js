const Problem = require("../model/Problem");
const User = require("../model/authUser");
const Submission = require("../model/Submission");

const getProblems = async (req, res, next) => {
  try {
    const problems = await Problem.find({})
      .select("title difficulty tags timeLimit memoryLimit createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Problems retrieved successfully",
      count: problems.length,
      problems,
    });
  } catch (error) {
    next(error);
  }
};

const getProblemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem retrieved successfully",
      problem,
    });
  } catch (error) {
    next(error);
  }
};

const getProblemsStats = async (req, res, next) => {
  try {
    const problemsCount = await Problem.countDocuments({});
    const usersCount = await User.countDocuments({});
    const submissionsCount = await Submission.countDocuments({});

    // Fetch average execution time from accepted submissions
    const acceptedSubmissions = await Submission.find({ status: "Accepted" }).select("executionTime");
    let avgExecutionTime = 4.2; // default fallback
    if (acceptedSubmissions.length > 0) {
      const sum = acceptedSubmissions.reduce((acc, sub) => acc + (sub.executionTime || 0), 0);
      avgExecutionTime = (sum / acceptedSubmissions.length).toFixed(1);
    }

    return res.status(200).json({
      success: true,
      problemsCount,
      usersCount,
      submissionsCount,
      avgExecutionTime: parseFloat(avgExecutionTime),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblems,
  getProblemById,
  getProblemsStats,
};
