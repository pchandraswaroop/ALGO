/**
 * Request logging middleware
 * Logs incoming requests with method, path, and response time
 */
const logger = (req, res, next) => {
  const start = Date.now();

  // Log when response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`,
    );
  });

  next();
};

module.exports = logger;
