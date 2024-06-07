import express from "express";
import { createBlog, getBlogs } from "../controllers/blog.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createBlog);
router.get("/get", getBlogs);

export default router;
