const mongoose = require("mongoose");

const authUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

authUserSchema.pre("save", function (next) {
  if (!this.fullName && this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
  }
  if (!this.username && this.email) {
    this.username = this.email.split("@")[0] + "_" + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

const AuthUser = mongoose.model("AuthUser", authUserSchema);

module.exports = AuthUser;
