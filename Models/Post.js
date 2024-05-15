import mongoose from "mongoose";

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

  //   follows: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  //   following:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export const Post = mongoose.model("Post", postSchema);
