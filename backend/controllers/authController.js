import bcrypt from "bcrypt";
import crypto from "crypto";
import { Resend } from "resend";
import User from "../models/User.js";

export const forgotPassword = async (req, res) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

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
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">

        <!-- Card Container -->
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:40px; box-shadow:0 4px 20px rgba(0,0,0,0.05);">
          
          <!-- Logo / Title -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h2 style="margin:0; color:#111827;">Corporate Expense Manager</h2>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h3 style="margin:0; color:#374151;">Password Reset Verification</h3>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td align="center" style="padding-bottom:30px; color:#6b7280; font-size:14px;">
              We received a request to reset your password.
              Use the verification code below to proceed.
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <div style="
                display:inline-block;
                background:#eef2ff;
                color:#4f46e5;
                font-size:28px;
                font-weight:bold;
                letter-spacing:8px;
                padding:15px 30px;
                border-radius:8px;
              ">
                ${otp}
              </div>
            </td>
          </tr>

          <!-- Expiry -->
          <tr>
            <td align="center" style="color:#9ca3af; font-size:13px; padding-bottom:30px;">
              This code will expire in <strong>10 minutes</strong>.
            </td>
          </tr>

          <!-- Security Note -->
          <tr>
            <td align="center" style="color:#9ca3af; font-size:12px;">
              If you did not request this password reset, you can safely ignore this email.
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <table width="480" cellpadding="0" cellspacing="0" style="margin-top:20px;">
          <tr>
            <td align="center" style="color:#9ca3af; font-size:12px;">
              © ${new Date().getFullYear()} Corporate Expense Manager. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
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

    if (!user) return res.status(404).json({ message: "User not found" });

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

    if (!user) return res.status(404).json({ message: "User not found" });

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
