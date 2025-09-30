import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  console.log("Full headers:", req.headers);

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Malformed token" });
  }

  const token = parts[1];

  try {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    const user = await User.findOne({ _id: decoded.id });

    if(!user) {
        return res.status(401).json({ message: "Invalid user credentials" });
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
