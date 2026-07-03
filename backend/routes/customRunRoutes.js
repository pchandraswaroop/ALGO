const express = require("express");

const { runCustomInput } = require("../controller/submissionController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, runCustomInput);

module.exports = router;
