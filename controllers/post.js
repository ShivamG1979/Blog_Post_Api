// controllers/post.js
import { Post, UserFile } from "../Models/Post.js";
import { Comments } from "../Models/Comments.js";
import { User } from "../Models/User.js";
import multer from "multer";
import cloudinary from "cloudinary";

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
export const upload = multer({ storage });

// File upload controller function
export const uploadFile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;

    if (!file || !name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required information" });
    }

    // We're using cloudinary from the global scope as it's initialized in server.js
    const uploadResponse = await cloudinary.v2.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`, 
      {
        folder: "home", // Set your desired folder in Cloudinary
        public_id: `user_${name}_${Date.now()}`,
      }
    );

    // Save file and user information to MongoDB
    const newUser = await UserFile.create({
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
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Add a function to upload an image and attach it to a post
export const uploadPostImage = async (req, res) => {
  try {
    const postId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Please provide an image file" });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is authorized to modify this post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to modify this post" });
    }

    // Upload to cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`, 
      {
        folder: "posts",
        public_id: `post_${postId}_${Date.now()}`,
      }
    );

    // Update post with new image URL
    post.imgUrl = uploadResponse.secure_url;
    await post.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      post,
      imageUrl: uploadResponse.secure_url
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Original post controller functions
export const addPost = async (req, res) => {
  const { title, description, imgUrl } = req.body;

  const post = await Post.create({
    title,
    description,
    imgUrl,
    user: req.user,
  });

  res.status(200).json({ message: "Post uploaded..!", post });
};

// Keep all your other controller functions...
export const getPosts = async (req, res) => {
  const posts = await Post.find();

  if (posts.length == 0) return res.json({ message: "No Posts" });

  res.json({ posts });
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, description, imgUrl } = req.body;

  let post = await Post.findById(id);

  if (!post) return res.json({ message: "Invalid Id" });
  
  // Add permission check
  if(post.user.toString() !== req.user._id.toString()) 
    return res.status(403).json({error: "You are not authorized to update this post"});

  post.title = title;
  post.description = description;
  post.imgUrl = imgUrl;

  await post.save();

  res.json({ message: "Your post has been updated..!", post });
};

export const deletePost = async (req, res) => {
  const id = req.params.id;

  const post = await Post.findById(id);

  if (!post) return res.json({ message: "Invalid Id.." });

  if(post.user.toString() != req.user._id.toString()) 
    return res.json({message:"you are not authorize to delete this post"}) 

  await post.deleteOne();

  res.json({ message: "Your Post has been deleted" });
};

export const getPostById = async (req, res) => {
  const id = req.params.id;

  let post = await Post.findById(id);

  if (!post) return res.json({ message: "Post not exist" });

  res.json({ post, numberOfLikes: post.likes.length });
};

export const likePostById = async (req, res) => {
  const id = req.params.id;
  console.log('Like request received for post ID:', id);

  try {
    const post = await Post.findById(id); 
    if (!post) return res.json({ message: "Post not exist.." });

    if (post.likes.includes(req.user._id))
      return res.json({ message: "User alreday like this post" });

    post.likes.push(req.user._id);

    await post.save();

    res.json({ message: "post liked..", post });
  } catch (error) {
    res.json({ message: "Internal Sever Error Occure", error });
  }
};

export const unlikePostById = async (req, res) => {
  const id = req.params.id;
  
  try {
    const post = await Post.findById(id);
    if (!post) return res.json({ message: "Post not exist.." });

    // Check if user has liked the post
    const likeIndex = post.likes.indexOf(req.user._id);
    if (likeIndex === -1)
      return res.json({ error: "You haven't liked this post yet" });

    // Remove user from likes array
    post.likes.splice(likeIndex, 1);
    await post.save();

    res.json({ message: "Post unliked successfully", post });
  } catch (error) {
    res.json({ error: "Internal Server Error Occurred", details: error.message });
  }
};

export const commentPostById = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  if (!post) return res.json({ message: "Post not exist.." });

  const { comment } = req.body;

  // Create new comment
  const newComment = await Comments.create({
    comment,
    userId: req.user._id,
    postId: id,
  });

  // Get all comments for this post
  const allComments = await Comments.find({ postId: id })
    .populate('userId', 'name')
    .sort({ createdAt: -1 });
  
  // Format comments to match expected structure in frontend
  const formattedComments = allComments.map(comment => ({
    _id: comment._id,
    text: comment.comment,
    user: comment.userId ? comment.userId.name : 'Anonymous',
    createdAt: comment.createdAt
  }));

  res.json({ 
    message: "Comment added successfully", 
    postComment: newComment,
    comments: formattedComments  // Add this line to include all comments
  });
};

// Get comments with user details
export const getCommentByPostId = async (req, res) => {
  const id = req.params.id;
  
  try {
    const post = await Post.findById(id);
    if (!post) return res.json({ message: "Post not exist.." });

    const comments = await getFormattedComments(id);

    res.json({ 
      message: "Post comments retrieved", 
      postComment: comments 
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comments", error: error.message });
  }
};

// Helper function to retrieve and format comments with user data
async function getFormattedComments(postId) {
  // Find all comments for the post
  const comments = await Comments.find({ postId })
    .sort({ createdAt: -1 }) // Sort by most recent first
    .lean();
  
  // Get user information for each comment
  const formattedComments = await Promise.all(comments.map(async (comment) => {
    try {
      const user = await User.findById(comment.userId).lean();
      return {
        _id: comment._id,
        text: comment.comment,
        user: user ? user.name : "Anonymous",
        userId: comment.userId,
        createdAt: comment.createdAt
      };
    } catch (error) {
      console.error("Error formatting comment:", error);
      return { 
        _id: comment._id,
        text: comment.comment,
        user: "Anonymous",
        userId: comment.userId,
        createdAt: comment.createdAt
      };
    }
  }));
  
  return formattedComments;
}