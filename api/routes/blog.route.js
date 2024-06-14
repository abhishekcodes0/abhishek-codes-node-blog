import express from "express";
import {
  createBlog,
  getBlogs,
  getSingleBlog,
  getPublishedBlogs,
  updateBlog,
} from "../controllers/blog.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createBlog);
router.get("/get", getPublishedBlogs);
router.get("/get/all", getBlogs);
router.get("/get/:slug", getSingleBlog);
router.put("/update/:slug", verifyToken, updateBlog);

export default router;
