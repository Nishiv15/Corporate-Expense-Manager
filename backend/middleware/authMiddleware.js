import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * protect - verifies JWT and attaches user to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  // Look for Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // attach user (without passwordHash)
      const user = await User.findById(decoded.id).select("-passwordHash").lean();
      if (!user) return res.status(401).json({ message: "User not found" });
      req.user = user;
      return next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

/**
 * restrictTo - role-based guard, pass allowed roles e.g. ['manager','admin']
 */
export const restrictTo = (...allowed) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!allowed.includes(req.user.userType)) {
      return res.status(403).json({ message: "Forbidden: insufficient privileges" });
    }
    next();
  };
};