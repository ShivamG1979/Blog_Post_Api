import { Post } from "../Models/Post.js";
import { Comments } from "../Models/Comments.js";

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

  (post.title = title),
    (post.description = description),
    (post.imgUrl = imgUrl);

  await post.save();

  res.json({ message: "Your post has been updated..!", post });
};

export const deletePost = async (req, res) => {
  const id = req.params.id;

  const post = await Post.findById(id);

  if (!post) return res.json({ message: "Invalid Id.." });

  if(post.user.toString() != req.user._id.toString()) return res.json({message:"you are not authorize to delete this post"}) 

  await post.deleteOne();

  res.json({ message: "Your Post has been deleted" });
};

export const getPostById = async (req, res) => {
  const id = req.params.id;

  let post = await Post.findById(id);

  if (!post) return res.json({ message: "Post not exist" });

  res.json({ post, numberOfLikes: post.likes.length });
};

// extra..

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

export const commentPostById = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  if (!post) return res.json({ message: "Post not exist.." });

  const { comment } = req.body;

  const postComment = await Comments.create({
    comment,
    userId: req.user,
    postId: id,
  });

  res.json({ message: "comment added", postComment });
};


export const getCommentByPostId = async (req,res) =>{
   const id = req.params.id;
   const post = await Post.findById(id);
   if (!post) return res.json({ message: "Post not exist.." });

   const postComment = await Comments.find({postId:id})

   if(!postComment) return res.json({message:"no comments"});

   res.json({message:"post comments", postComment});
}
