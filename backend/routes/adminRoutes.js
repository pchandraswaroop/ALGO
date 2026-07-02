const express = require("express");
const {
  getUsers,
  deleteUser,
  getAdminProblems,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemTestCases,
  createTestCase,
  deleteTestCase,
} = require("../controller/adminController");
const { verifyToken } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");

const router = express.Router();

router.use(verifyToken, requireAdmin);

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

router.get("/problems", getAdminProblems);
router.post("/problems", createProblem);
router.put("/problems/:id", updateProblem);
router.delete("/problems/:id", deleteProblem);

router.get("/problems/:id/testcases", getProblemTestCases);
router.post("/problems/:id/testcases", createTestCase);
router.delete("/testcases/:id", deleteTestCase);

module.exports = router;
