import express from "express";
import {
  register,
  login,
  getAllUsers,
  getUserById,
} from "../controllers/user.js";

import { Authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", (req, res) => res.json({ message: "This is Home Route" }));

router.post("/register", register);

router.post("/login", login);

router.get("/users", getAllUsers);

router.get("/user/:id",Authenticate, getUserById);

router.get("/superman", Authenticate, (req, res) =>
  res.json({ message: "This is Superman route..!", user: req.user })
);

export default router;
