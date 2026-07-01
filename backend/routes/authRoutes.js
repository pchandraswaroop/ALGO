const express = require("express");
const { register, login, logout } = require("../controller/authController");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/requestValidator");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "AlgoU Auth Server is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Protected route example (Legacy, keep for compatibility)
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile retrieved",
    user: req.user,
  });
});

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);

module.exports = router;
