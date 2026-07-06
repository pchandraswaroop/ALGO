const express = require("express");
const {
  getProblems,
  getProblemById,
  getProblemsStats,
} = require("../controller/problemController");

const router = express.Router();

router.get("/stats", getProblemsStats);
router.get("/", getProblems);
router.get("/:id", getProblemById);

module.exports = router;
