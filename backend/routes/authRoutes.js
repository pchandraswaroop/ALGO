const express = require("express");
const { register, login } = require("../controller/authController");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "AlgoU Auth Server is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;
