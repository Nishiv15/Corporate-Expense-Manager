import jwt from "jsonwebtoken";

const generateToken = (user) => {
  // payload: user id and userType and company
  return jwt.sign(
    { id: user._id.toString(), userType: user.userType, company: user.company?.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export default generateToken;