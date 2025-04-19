import mongoose from "mongoose";

// User File Schema for file uploads
const userFileSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  filename: String,
  public_id: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export const UserFile = mongoose.model("UserFile", userFileSchema);

// Post Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  imgUrl: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  rating: [{ type: Number }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  follows: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // Optional: You can add a reference to files if you want to associate files with posts
  files: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "UserFile" 
  }]
});

export const Post = mongoose.model("Post", postSchema);