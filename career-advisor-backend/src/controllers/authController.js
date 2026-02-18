import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../utils/email.js";
import { saveOTP, verifyOTP as checkOTP } from "../utils/otpStore.js";

/**
 * SIGNUP — Create a new user + send OTP email
 */
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        passwordHash,
      },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    // Generate OTP and store temporarily
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    saveOTP(email, otp);

    // Send OTP email
    await sendVerificationEmail(email, otp);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user,
      message: "Signup successful! OTP sent to your email for verification.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

/**
VERIFY EMAIL OTP — Confirm email ownership
 */
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP are required" });

    const isValid = checkOTP(email, otp);
    if (!isValid)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    res.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error(" OTP verification error:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

/**
 LOGIN — Authenticate user and return token
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ error: "Invalid credentials (user not found)" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(400).json({ error: "Invalid credentials (wrong password)" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(" Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

/**
  FORGOT PASSWORD — Send OTP to reset password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ error: "No account found for this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    saveOTP(email, otp);
    await sendResetPasswordEmail(email, otp);

    res.json({ message: "Reset OTP sent to your email" });
  } catch (err) {
    console.error(" Forgot password error:", err);
    res.status(500).json({ error: "Failed to send reset OTP" });
  }
};

/**
RESET PASSWORD — Verify OTP + update password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ error: "All fields are required" });

    const valid = checkOTP(email, otp);
    if (!valid)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(" Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

/**
 ME — Return currently logged in user's info
 */
export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(" Me route error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
