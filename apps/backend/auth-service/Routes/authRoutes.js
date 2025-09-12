const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");

// Manual login
router.post("/login", authController.login);

// Google OAuth
router.get("/google", authController.googleRedirect);
router.get("/google/callback", authController.googleCallback);
router.post("/google/complete-signup", authController.completeGoogleSignup);


// OTP & Complete Signup
router.post("/send-otp", authController.sendOTP);
router.post("/complete-signup", authController.completeSignup);

module.exports = router;


