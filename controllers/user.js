import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt, { decode } from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  // console.log(req.body);
  let user = await User.findOne({ email });

  if (user) return res.status(404).json({ message: "User already exist..!" });

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({ name, email, password: hashPassword });

  res.status(201).json({ message: "User Register Successfully!", user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not exist..!" });

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.json({ message: "Invalid Credential.." });

  const token = jwt.sign({ userId: user.id }, process.env.JWT, {
    expiresIn: "1d",
  });

  res.status(200).json({ message: `Welcome ${user.name}`, token });
};

export const getAllUsers = async (req, res) => {
  const user = await User.find();
  if (!user) return res.json({ message: "No User Find..!" });

  res.json({ user });
};


export const getUserById = async (req,res) =>{
  const id = req.params.id
  
  let user = await User.findById(id)

  if(!user) return res.json({message:'User not exist'})

  res.json({user});


}