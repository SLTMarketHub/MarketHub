import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client, google } from "google-auth-library";
import crypto from "crypto";
import axios from "axios";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import User from "../Model/userModel.js";

dotenv.config();

// ================== CONFIG ==================
const CUSTOMER_API_URL =
  process.env.TMF629_CUSTOMER_API_BASE ||
  "https://markethub-api-gateway.onrender.com/tmf-api/customer/v5/customer";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

// Gmail OAuth2 for Nodemailer
const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

// Temporary OTP store
let otpStore = {};

// ================== HELPERS ==================

// Generate JWT token
const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      username: user.username || user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// Create TMF Customer Profile
async function createCustomerProfile(user) {
  if (!user || !user.role) return;
  if (user.role.toLowerCase() !== "customer") return;

  const customerPayload = {
    "@type": "Individual",
    name: user.username || user.email.split("@")[0],
    status: "Active",
    contactMedium: [
      {
        "@type": "EmailContact",
        contactType: "email",
        preferred: true,
        emailAddress: user.email,
      },
    ],
    relatedParty: [
      {
        "@type": "Individual",
        role: "Customer",
        id: user._id,
        "@referredType": "AuthUser",
      },
    ],
    engagedParty: {
      "@type": "Individual",
      href: `https://markethub-api-gateway.onrender.com/tmf-api/authService/auth/${user._id}`,
      id: user._id,
      name: user.username,
      "@referredType": "AuthUser",
    },
  };

  try {
    const response = await axios.post(CUSTOMER_API_URL, customerPayload);
    console.log("✅ TMF Customer profile created:", response.data);
  } catch (error) {
    console.error("❌ Failed to create TMF Customer profile:", error.message);
  }
}

// ================== ROUTES ==================

// Register New User (Manual)
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({
      username,
      email,
      password,
      role: "Customer",
    });
    await user.save();

    await createCustomerProfile(user);

    const token = generateToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Manual login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.username || user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Google OAuth redirect
export const googleRedirect = (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["profile", "email"],
  });
  res.redirect(url);
};

// Google OAuth callback
export const googleCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });

    if (user) {
      const token = generateToken(user);
      return res.redirect(
        `${process.env.FRONTEND_URL}/google-callback?token=${token}&role=${user.role}&username=${encodeURIComponent(
          user.username
        )}`
      );
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/success?needRole=true&email=${payload.email}&name=${payload.name}`
      );
    }
  } catch (error) {
    console.error("Google login error", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
  }
};

// Complete Google signup
export const completeGoogleSignup = async (req, res) => {
  try {
    const { email, name, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role required" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = generateToken(existingUser);
      return res.json({ token, user: existingUser });
    }

    const generatedPassword = crypto.randomBytes(12).toString("hex");

    const user = new User({
      email,
      username: name || email.split("@")[0],
      role,
      password: generatedPassword,
    });

    await user.save();

    if (user.role === "Customer") {
      await createCustomerProfile(user);
    }

    const token = generateToken(user);

    res.json({
      message: "Google signup complete",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Complete Google Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Send OTP using Gmail OAuth2
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `"MarketHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your MarketHub OTP",
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP ${otp} sent to ${email}`);

    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error in sendOtp:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// Complete signup (manual or OTP-based)
export const completeSignup = async (req, res) => {
  try {
    const { username, email, password, role, otp } = req.body;

    if (!username || !email || !role)
      return res.status(400).json({ error: "Missing required fields" });

    const otpData = otpStore[email];
    if (!otpData && !req.body.google)
      return res.status(400).json({ error: "OTP not found or expired" });

    if (otpData && Date.now() > otpData.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ error: "OTP expired" });
    }

    if (otpData && otpData.otp != otp)
      return res.status(400).json({ error: "Invalid OTP" });

    let user = await User.findOne({ email });

    if (user) {
      if (username) user.username = username;
      if (role) user.role = role;
      if (password) user.password = password;
      await user.save();
    } else {
      user = new User({ username, email, password, role });
      await user.save();
    }

    delete otpStore[email];

    if (user.role && user.role.toLowerCase() === "customer") {
      await createCustomerProfile(user);
    }

    const token = generateToken(user);

    res.status(201).json({
      message: "Signup complete",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error completing signup:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
