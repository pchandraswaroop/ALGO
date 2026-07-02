const Problem = require("../model/Problem");

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

module.exports = {
  getProblems,
  getProblemById,
};
