import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../Model/userModel.js";
import { sendEmail } from "../utils/emailService.js";
import crypto from "crypto";
import axios from "axios";

// ================== CONFIG ==================
const CUSTOMER_API_URL =
    process.env.TMF629_CUSTOMER_API_BASE ||
    "https://markethub-api-gateway.onrender.com/tmf-api/customer/v5/customer";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

// Temporary OTP store
let otpStore = {};

// Generate JWT
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

// Create TMF629 Customer Profile
export async function createCustomerProfile(user) {
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

// ================= ROUTE LOGIC =================

// Register New User
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

    try {
      await createCustomerProfile(user);
    } catch (err) {
      await User.findByIdAndDelete(user._id);
      throw err;
    }

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
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Manual Login
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

// Complete Google Signup
export const completeGoogleSignup = async (req, res) => {
  try {
    const { email, name, role } = req.body;

    if (!email || !role)
      return res
          .status(400)
          .json({ message: "Email and role required" });

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
      try {
        await createCustomerProfile(user);
      } catch (err) {
        console.error("Failed to create TMF Customer profile:", err);
      }
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

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { otp, expiresAt: Date.now() + 60 * 1000 };

    await sendEmail(
        email,
        "Your OTP Code",
        `<p>Your OTP is: <b>${otp}</b></p>`
    );

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res
        .status(500)
        .json({ message: "Failed to send OTP", error: error.message });
  }
};

// Complete Signup (manual or OTP flow)
export const completeSignup = async (req, res) => {
  try {
    const { username, email, password, role, otp } = req.body;

    if (!username || !email || !role)
      return res
          .status(400)
          .json({ error: "Missing required fields" });

    const otpData = otpStore[email];

    if (!otpData && !req.body.google)
      return res
          .status(400)
          .json({ error: "OTP not found or expired" });

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

    if (user.role?.toLowerCase() === "customer") {
      try {
        await createCustomerProfile(user);
      } catch (err) {
        console.error("⚠️ Failed to Create customer record:", err);
      }
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
