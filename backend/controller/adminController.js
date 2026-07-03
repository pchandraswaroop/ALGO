const AuthUser = require("../model/authUser");
const Problem = require("../model/Problem");
const TestCase = require("../model/TestCase");
const Submission = require("../model/Submission");
const {
  deleteUserWithSubmissions,
} = require("../services/userDeletionService");

const getUsers = async (req, res, next) => {
  try {
    const users = await AuthUser.find({})
      .select("firstName lastName username email role createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.adminUser?._id?.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Admins cannot delete their own account from admin panel",
      });
    }

    const deletedUser = await deleteUserWithSubmissions(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User and related submissions deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAdminProblems = async (req, res, next) => {
  try {
    const problems = await Problem.find({}).sort({ createdAt: -1 });

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

const createProblem = async (req, res, next) => {
  try {
    const problem = await Problem.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem,
    });
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    await TestCase.deleteMany({ problemId: id });
    await Submission.deleteMany({ problemId: id });

    return res.status(200).json({
      success: true,
      message: "Problem and related test cases deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getProblemTestCases = async (req, res, next) => {
  try {
    const { id } = req.params;

    const testCases = await TestCase.find({ problemId: id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Test cases retrieved successfully",
      count: testCases.length,
      testCases,
    });
  } catch (error) {
    next(error);
  }
};

const createTestCase = async (req, res, next) => {
  try {
    const { input, expectedOutput, isHidden } = req.body;
    const { id: problemId } = req.params;

    const problem = await Problem.findById(problemId).select("_id");
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    if (!input || !expectedOutput) {
      return res.status(400).json({
        success: false,
        message: "input and expectedOutput are required",
      });
    }

    const testCase = await TestCase.create({
      problemId,
      input,
      expectedOutput,
      isHidden: typeof isHidden === "boolean" ? isHidden : true,
    });

    return res.status(201).json({
      success: true,
      message: "Test case created successfully",
      testCase,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTestCase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTestCase = await TestCase.findByIdAndDelete(id);

    if (!deletedTestCase) {
      return res.status(404).json({
        success: false,
        message: "Test case not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test case deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getAdminProblems,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemTestCases,
  createTestCase,
  deleteTestCase,
};
