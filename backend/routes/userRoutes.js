const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controller/userController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Protected profile routes
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);
router.delete("/profile", verifyToken, deleteUserProfile);

module.exports = router;
