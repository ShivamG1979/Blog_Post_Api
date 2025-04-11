import express from "express";
import {
  register, login, getAllUsers, getUserById,
} from "../controllers/user.js";

import { Authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", (req, res) => res.json({ message: "This is Home Route" }));

router.post("/register", register);

router.post("/login", login);

router.get("/users", getAllUsers);

router.get("/user/:id",Authenticate, getUserById);

router.get("/me", Authenticate, (req, res) => {
  res.status(200).json({ user: req.user });
});

// In user.js router file, add this new route:

export default router;
