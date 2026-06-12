const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const DBConnection = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  process.exit(1);
}

const corsOrigin = process.env.FRONTEND_URL || true;

// Request logging middleware
app.use(logger);

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const startServer = async () => {
  try {
    await DBConnection();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access the server at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

app.use("/", authRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

startServer();
