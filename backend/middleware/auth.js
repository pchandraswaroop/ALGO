const jwt = require("jsonwebtoken");

/**
 * Verify JWT token from Authorization header or cookie
 * Attaches decoded user data to req.user
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header or cookie
    const token =
      req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    res.status(500).json({
      success: false,
      message: "Token verification failed",
    });
  }
};

module.exports = { verifyToken };
