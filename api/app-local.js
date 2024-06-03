import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const mongoUrl = process.env.MONGODB_URL;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
