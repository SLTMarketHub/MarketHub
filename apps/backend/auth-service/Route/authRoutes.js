import express from 'express';
import * as authController from '../Controller/authController.js';

const router = express.Router();

// User registration and login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Google OAuth
router.get('/google', authController.googleRedirect);
router.get('/google/callback', authController.googleCallback);
router.post('/google/complete-signup', authController.completeGoogleSignup);

// OTP & Complete Signup
router.post('/send-otp', authController.sendOTP);
router.post('/complete-signup', authController.completeSignup);

export default router;
