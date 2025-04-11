import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import userRouter from "./router/user.js";
import { postRouter } from "./router/post.js";
import bodyParser from "express";
import cors from 'cors'

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }) 
);

// creating config file
config({ path: ".env" });

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
  .then(() => console.log("MongoDB is Connected..!"));

// Server Setup
const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on port ${port}`));

