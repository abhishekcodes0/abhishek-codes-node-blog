import Blog from "../models/blog.model.js";
import { errorHandler } from "../utils/error.js";

import { s3 } from "../aws-config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import path from "path";

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
    const dateDescBlogs = allBlogs.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    res.status(201).json(dateDescBlogs);
  } catch (error) {
    next(error);
  }
};

export const getPublishedBlogs = async (req, res, next) => {
  try {
    const allBlogs = await Blog.find({ status: "published" });
    const dateDescBlogs = allBlogs.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    res.status(201).json(dateDescBlogs);
  } catch (error) {
    next(error);
  }
};

export const getSingleBlog = async (req, res, next) => {
  try {
    const singleBlog = await Blog.findOne({ slug: req.params.slug });
    res.status(201).json(singleBlog);
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      {
        $set: {
          title: req.body.title,
          status: req.body.status,
          summary: req.body.summary,
          slug: req.body.slug,
          category: req.body.category,
          isFeatured: req.body.isFeatured,
          thumbnail: req.body.thumbnail,
          content: req.body.content,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedBlog._doc);
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (req, res, next) => {
  const file = req.file;
  const fileName = `${v4()}${path.extname(file.originalname)}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // Make the file publicly readable
  };

  try {
    await s3.send(new PutObjectCommand(params));
    const url = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    res.status(200).send({ url });
  } catch (error) {
    next(error);
  }
};
