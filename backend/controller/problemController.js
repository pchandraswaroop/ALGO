const Problem = require("../model/Problem");
const User = require("../model/authUser");
const Submission = require("../model/Submission");

const getProblems = async (req, res, next) => {
  try {
    const problems = await Problem.find({})
      .select("title difficulty tags timeLimit memoryLimit createdAt")
      .lean()
      .sort({ createdAt: -1 });

    const stats = await Submission.aggregate([
      {
        $group: {
          _id: "$problemId",
          total: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$verdict", "Accepted"] }, 1, 0] }
          }
        }
      }
    ]);

    const statsMap = {};
    stats.forEach(s => {
      if (s._id) {
        statsMap[s._id.toString()] = {
          total: s.total,
          accepted: s.accepted
        };
      }
    });

    const problemsWithStats = problems.map(p => {
      const s = statsMap[p._id.toString()] || { total: 0, accepted: 0 };
      const acceptanceRate = s.total > 0 ? Math.round((s.accepted / s.total) * 100) : 0;
      return {
        ...p,
        acceptanceRate,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Problems retrieved successfully",
      count: problemsWithStats.length,
      problems: problemsWithStats,
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
