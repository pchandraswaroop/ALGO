const AuthUser = require("../model/authUser");
const bcrypt = require("bcryptjs");
const {
  deleteUserWithSubmissions,
} = require("../services/userDeletionService");

// GET /api/users/profile - Get logged-in user profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await AuthUser.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile - Update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const { username, email, password, fullName, dateOfBirth } = req.body;
    const user = await AuthUser.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update username if provided and changed
    if (username && username !== user.username) {
      const existingUsername = await AuthUser.findOne({
        username: username.toLowerCase().trim(),
      });
      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: "Username is already taken",
        });
      }
      user.username = username.toLowerCase().trim();
    }

    // Update email if provided and changed
    if (email && email.toLowerCase().trim() !== user.email) {
      const existingEmail = await AuthUser.findOne({
        email: email.toLowerCase().trim(),
      });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }
      user.email = email.toLowerCase().trim();
    }

    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }
      const saltRounds = 12;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    // Update other fields
    if (fullName !== undefined) user.fullName = fullName.trim();
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;

    // Check if firstName and lastName need updating for backward compatibility
    if (fullName) {
      const parts = fullName.trim().split(" ");
      user.firstName = parts[0] || "";
      user.lastName = parts.slice(1).join(" ") || "";
    }

    await user.save();

    // Exclude password from response
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/profile - Delete own account + cascade delete all user's submissions
const deleteUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const deletedUser = await deleteUserWithSubmissions(userId);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Clear cookie after successful account deletion
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Account and all associated submissions deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
