import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true // Add index for better performance
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    index: true // Add index for better performance
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for faster queries
commentSchema.index({ postId: 1, createdAt: -1 });

export const Comments = mongoose.model("Comments", commentSchema);