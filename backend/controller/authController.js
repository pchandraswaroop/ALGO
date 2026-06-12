const AuthUser = require("../model/authUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const normalizeEmail = (email) => email.trim().toLowerCase();

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return process.env.JWT_SECRET;
};

const getCookieOptions = () => ({
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

//post route
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const normalizedEmail = normalizeEmail(email);
    const existingUser = await AuthUser.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await AuthUser.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      getJwtSecret(),
      {
        expiresIn: "24h",
      },
    );

    // Prepare user response (exclude password)
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    };

    return res.status(201).cookie("token", token, getCookieOptions()).json({
      success: true,
      message: "User registered successfully!",
      user: userResponse,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

//login route
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const normalizedEmail = normalizeEmail(email);
    const user = await AuthUser.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      getJwtSecret(),
      {
        expiresIn: "24h",
      },
    );

    // Prepare user response (exclude password)
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    res.status(200).cookie("token", token, getCookieOptions()).json({
      success: true,
      message: "Login successful!",
      user: userResponse,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
