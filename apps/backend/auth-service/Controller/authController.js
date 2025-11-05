const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../Model/userModel");
const { sendEmail } = require("../utils/emailService");
const crypto = require("crypto");
const axios = require("axios");

// ================== CONFIG ==================
const CUSTOMER_API_BASE =
  process.env.TMF629_CUSTOMER_API_BASE ||
  "https://markethub-api-gateway.onrender.com/tmf-api/customer/v5/customer";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

let otpStore = {}; // Temporary in-memory OTP store

// ================== UTILITIES ==================
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email, username: user.username || user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// Create TMF629 Customer Profile
async function createCustomerProfile(user, userId) {
  try {
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
          id: userId,
          "@referredType": "AuthUser",
        },
      ],
      engagedParty: {
        "@type": "Individual",
        href: `https://markethub-api-gateway.onrender.com/tmf-api/authService/auth/${userId}`,
        id: userId,
        name: user.username,
        "@referredType": "AuthUser",
      },
    };

    const response = await axios.post(CUSTOMER_API_URL, customerPayload);
    console.log("✅ TMF Customer profile created:", response.data);
  } catch (error) {
    console.error("❌ Failed to create TMF Customer profile:", error.message);
  }
}

// ================== CONTROLLERS ==================

// Register New User (Manual)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "Customer",
    });
    await user.save();

    // Create TMF Customer Profile
    try {
      await createCustomerProfile({ username, email }, user._id);
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
exports.login = async (req, res) => {
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
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Google OAuth Redirect
exports.googleRedirect = (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["profile", "email"],
  });
  res.redirect(url);
};

// Google OAuth Callback
exports.googleCallback = async (req, res) => {
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
        `${process.env.FRONTEND_URL}/google-callback?token=${token}&role=${user.role}&username=${encodeURIComponent(user.username)}`
      );
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/success?needRole=true&email=${payload.email}&name=${payload.name}`
      );
    }
  } catch (error) {
    console.error("Google login error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
  }
};

// Complete Google Signup
exports.completeGoogleSignup = async (req, res) => {
  try {
    const { email, name, role } = req.body;

    if (!email || !role)
      return res.status(400).json({ message: "Email and role required" });

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = generateToken(existingUser);
      return res.json({ message: "Login successful", token, user: existingUser });
    }

    const generatedPassword = crypto.randomBytes(12).toString("hex");
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const user = new User({
      email,
      username: name || email.split("@")[0],
      role,
      password: hashedPassword,
    });

    await user.save();

    // Create TMF customer profile if customer
    if (user.role === "Customer") {
      try {
        await createCustomerProfile(user, user._id);
      } catch (err) {
        console.error("Failed to create TMF Customer profile:", err.message);
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
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 min validity

    await sendEmail(email, "Your OTP Code", `<p>Your OTP is: <b>${otp}</b></p>`);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Complete Signup (manual + OTP)
exports.completeSignup = async (req, res) => {
  try {
    const { username, email, password, role, otp } = req.body;

    if (!username || !email || !role)
      return res.status(400).json({ error: "Missing required fields" });

    const otpData = otpStore[email];
    if (!otpData) return res.status(400).json({ error: "OTP not found or expired" });
    if (Date.now() > otpData.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ error: "OTP expired" });
    }
    if (otpData.otp != otp)
      return res.status(400).json({ error: "Invalid OTP" });

    let user = await User.findOne({ email });
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    if (user) {
      user.username = username || user.username;
      user.role = role || user.role;
      if (hashedPassword) user.password = hashedPassword;
      await user.save();
    } else {
      user = new User({ username, email, password: hashedPassword, role });
      await user.save();
    }

    delete otpStore[email];

    if (user.role === "Customer") {
      try {
        await createCustomerProfile(user, user._id);
      } catch (err) {
        console.error("Failed to create TMF Customer profile:", err.message);
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
