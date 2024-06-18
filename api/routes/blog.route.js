import express from "express";
import {
  createBlog,
  getBlogs,
  getSingleBlog,
  getPublishedBlogs,
  updateBlog,
  uploadImage,
} from "../controllers/blog.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/create", verifyToken, createBlog);
router.get("/get", getPublishedBlogs);
router.get("/get/all", getBlogs);
router.get("/get/:slug", getSingleBlog);
router.put("/update/:slug", verifyToken, updateBlog);
router.post("/upload-image", verifyToken, upload.single("image"), uploadImage);

export default router;
