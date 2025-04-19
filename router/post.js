// router/post.js
import express from "express";
import {
  addPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePostById,
  commentPostById,
  getCommentByPostId,
  unlikePostById,
  upload,
  uploadFile,
  uploadPostImage
} from "../controllers/post.js";

import { Authenticate } from "../middlewares/auth.js";

export const postRouter = express.Router();

// Post routes
postRouter.post("/addpost", Authenticate, addPost);
postRouter.get("/posts", getPosts);
postRouter.get("/post/:id", Authenticate, getPostById);
postRouter.put("/post/:id", Authenticate, updatePost);
postRouter.delete("/post/:id", Authenticate, deletePost);
postRouter.post("/post/like/:id", Authenticate, likePostById);
postRouter.post("/post/comment/:id", Authenticate, commentPostById);
postRouter.get("/post/comment/:id", Authenticate, getCommentByPostId);
postRouter.delete("/post/like/:id", Authenticate, unlikePostById);

// File upload routes
postRouter.post("/upload", upload.single("file"), uploadFile);
postRouter.post("/post/upload-image/:id", Authenticate, upload.single("image"), uploadPostImage);