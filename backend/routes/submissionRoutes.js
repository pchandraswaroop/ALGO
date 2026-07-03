const express = require("express");
const {
  createSubmission,
  getUserSubmissions,
  getSubmissionById,
  runCustomInput,
} = require("../controller/submissionController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, createSubmission);
router.post("/custom-run", verifyToken, runCustomInput);
router.get("/", verifyToken, getUserSubmissions);
router.get("/:id", verifyToken, getSubmissionById);

module.exports = router;
