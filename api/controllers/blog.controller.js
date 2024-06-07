import Blog from "../models/blog.model.js";
import { errorHandler } from "../utils/error.js";

export const createBlog = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorised to do this"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const newBlog = new Blog({
    ...req.body,
    userId: req.user.id,
  });

  try {
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
};

export const getBlogs = async (req, res, next) => {
  try {
    const allBlogs = await Blog.find({});
    console.log("allBlogs", allBlogs);
    res.status(201).json(allBlogs);
  } catch (error) {
    next(error);
  }
};
