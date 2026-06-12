/**
 * Centralized error handling middleware
 * Catches and formats all errors consistently
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const validationErrors = Object.values(err.errors).map(
      (error) => error.message,
    );
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token has expired",
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
