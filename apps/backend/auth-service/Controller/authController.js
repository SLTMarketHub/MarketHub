const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../Model/userModel");
const { sendEmail } = require("../utils/emailService");
const crypto = require("crypto");

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
        { id: user._id, role: user.role, email: user.email, username: user.username || user.name },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
// ================= ROUTE LOGIC =================

// Manual login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Generate token
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
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Google OAuth redirect
exports.googleRedirect = (req, res) => {
    const url = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["profile", "email"],
    });
    res.redirect(url);
};

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
            // Existing user → login
            const token = jwt.sign(
                { id: user._id, role: user.role, email: user.email, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.redirect(
                `${process.env.FRONTEND_URL}/google-callback?token=${token}&role=${user.role}&username=${encodeURIComponent(user.username)}`
            );


        } else {
            // New user → ask for role
            return res.redirect(
                `${process.env.FRONTEND_URL}/auth/google/success?needRole=true&email=${payload.email}&name=${payload.name}`
            );
        }
    } catch (error) {
        console.error("Google login error", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
    }
};


exports.completeGoogleSignup = async (req, res) => {
    try {
        const { email, name, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ message: "Email and role required" });
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            // User already exists → just login
            const token = jwt.sign(
                { id: existingUser._id, role: existingUser.role, email: existingUser.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            return res.json({ token, user: existingUser });
        }

        // Auto-generate a secure random password
        const generatedPassword = crypto.randomBytes(12).toString("hex");
        // Create new user
        const user = new User({
            email,
            username: name || email.split("@")[0],
            role,
            password: generatedPassword, // hashed auto-generated password
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, user });
    } catch (error) {
        console.error("Complete Google Signup error", error);
        res.status(500).json({ message: "Server error" });
    }
};



// Send OTP
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = { otp, expiresAt: Date.now() + 60 * 1000 };

        await sendEmail(email, "Your OTP Code", `<p>Your OTP is: <b>${otp}</b></p>`);

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
};

exports.completeSignup = async (req, res) => {
    try {
        const { username, email, password, role, otp } = req.body;

        if (!username || !email || !role) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const otpData = otpStore[email];
        if (!otpData && !req.body.google) {
            return res.status(400).json({ error: "OTP not found or expired" });
        }

        if (otpData && Date.now() > otpData.expiresAt) {
            delete otpStore[email];
            return res.status(400).json({ error: "OTP expired" });
        }

        if (otpData && otpData.otp != otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        let user = await User.findOne({ email });
        if (user) {
            // Update profile if user exists
            if (username) user.username = username;
            if (role) user.role = role;
            await user.save();
        } else {
            user = new User({ username, email, password, role });
            await user.save();
        }

        delete otpStore[email];

        const token = generateToken(user);

        res.status(201).json({
            message: "User registered/updated successfully",
            userId: user._id,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Error completing signup:", err);
        res.status(500).json({ error: "Server error" });
    }
};

