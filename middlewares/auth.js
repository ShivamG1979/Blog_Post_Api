import { User } from "../Models/User.js";
import jwt from "jsonwebtoken";

export const Authenticate = async (req, res, next) => {
  const token = req.header("Auth");
try {
    if (!token) return res.json({ message: "Login First..!" });
    

    const decoded = jwt.verify(token, process.env.JWT);
    const id = decoded.userId;
    
    let user = await User.findById(id);
    if (!user) return res.json({ message: "User Not exist" });
    req.user = user;
    

    next();
} catch (err) {
  if(err.name == "TokenExpiredError") return res.json({message:"Token Expired please login"})
  
  res.json({message:"Internal Server Error.."});
}

};
