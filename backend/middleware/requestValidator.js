/**
 * Request validation middleware
 * Validates incoming request data
 */

const validateRegister = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const errors = [];

  if (
    !firstName ||
    typeof firstName !== "string" ||
    firstName.trim().length < 2
  ) {
    errors.push("firstName must be at least 2 characters");
  }

  if (!lastName || typeof lastName !== "string" || lastName.trim().length < 2) {
    errors.push("lastName must be at least 2 characters");
  }

  if (!email || !isValidEmail(email)) {
    errors.push("email must be a valid email address");
  }

  if (!password || password.length < 6) {
    errors.push("password must be at least 6 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push("email must be a valid email address");
  }

  if (!password) {
    errors.push("password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

/**
 * Simple email validation
 */
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

module.exports = { validateRegister, validateLogin };
