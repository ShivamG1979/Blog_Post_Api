import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  comment: {
    type: String,
    // required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Comments = mongoose.model("Comments", commentSchema);