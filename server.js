import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import userRouter from "./router/user.js";
import { postRouter } from "./router/post.js";
import bodyParser from "express";
import cors from 'cors';
import cloudinary from "cloudinary";

const app = express();

// Load environment variables first
config({ path: ".env" });

// Configure Cloudinary
const { v2: cloudinaryV2 } = cloudinary;
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }) 
);

app.use(bodyParser.json());

// userRouter
app.use("/api", userRouter);

// postRouter 
app.use("/api", postRouter);   

// DB Connection 
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "Blogging_MERN_Volcanus", 
  })
  .then(() => console.log("MongoDB is Connected..!"))
  .catch(err => console.error("MongoDB connection error:", err));

// Server Setup
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));