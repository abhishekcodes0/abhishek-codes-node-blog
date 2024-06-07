import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import blogRoutes from "./routes/blog.route.js";

dotenv.config();

export let secret;

if (process.env.NODE_ENV == "production") {
  const secret_name = "node-blog-keys";

  const client = new SecretsManagerClient({
    region: "ap-south-1",
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }

  secret = JSON.parse(response.SecretString);
}

const mongoUrl =
  process.env.NODE_ENV == "production"
    ? secret?.MONGODB_URL
    : process.env.MONGODB_URL;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((error) => console.log(error));

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
