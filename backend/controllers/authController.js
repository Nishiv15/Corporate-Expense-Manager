import bcrypt from "bcrypt";
import crypto from "crypto";
import { Resend } from "resend";
import User from "../models/User.js";

export const forgotPassword = async (req, res) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Generate 6-digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetCode = otp;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // Send email via Resend
    await resend.emails.send({
      from: "Expense Manager <onboarding@resend.dev>",
      to: user.email,
      subject: "Password Reset Verification Code",
      html: `
        <h2>Password Reset</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    return res.json({ message: "Verification code sent" });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (
      user.resetCode !== code ||
      !user.resetCodeExpires ||
      user.resetCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    return res.json({ message: "Code verified" });
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (
      user.resetCode !== code ||
      !user.resetCodeExpires ||
      user.resetCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    // Clear OTP
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
