import express from "express";
import {
  addPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePostById,
  commentPostById,
  getCommentByPostId
  // findCommentByPostId,
} from "../controllers/post.js";

import { Authenticate } from "../middlewares/auth.js";

export const postRouter = express.Router();

postRouter.post("/addpost", Authenticate, addPost);

postRouter.get("/posts", getPosts);

postRouter.get("/post/:id", Authenticate, getPostById);

postRouter.put("/post/:id", Authenticate, updatePost);

postRouter.delete("/post/:id", Authenticate, deletePost);
 
postRouter.post("/post/like/:id",Authenticate, likePostById);

postRouter.post("/post/comment/:id",Authenticate, commentPostById);

postRouter.get("/post/comment/:id", Authenticate, getCommentByPostId);

// file upload section start from here

// file uplaod
import mongoose from "mongoose";
import multer from "multer";
import cloudinary from "cloudinary";

const { v2: cloudinaryV2 } = cloudinary;

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: "dhnat7kyj",
  api_key: "913248448857885",
  api_secret: "S1mgGlkv8yYjcPMEuDkERpO20Gc",
});

// Create a mongoose model for your files and user information
const User = mongoose.model("UserFile", {
  name: String,
  email: String,
  password: String,
  filename: String,
  public_id: String,
  url: String,
});

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

postRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;

    if (!file || !name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required information" });
    }

    const uploadResponse = await cloudinaryV2.uploader.upload(file.buffer, {
      folder: "home", // Set your desired folder in Cloudinary
      public_id: `user_${name}_${Date.now()}`, // Unique public_id
    });

    // Save file and user information to MongoDB
    const newUser = await User.create({
      name,
      email,
      password,
      filename: file.originalname,
      public_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
    });

    // Send response with user data and file upload URL
    res.status(200).json({
      message: "File and user information uploaded to Cloudinary successfully",
      user: newUser,
      fileUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
