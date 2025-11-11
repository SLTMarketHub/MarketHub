import express from 'express';
import { protect } from '../Middleware/authMiddleware.js';
import { getUsers, getUser, updateUser } from '../Controller/userController.js';

const router = express.Router();

// Public: get all users
router.get('/', getUsers);

// Protected: get own profile
router.get('/profile', protect, getUser);

// Protected: update own profile
router.put('/profile', protect, updateUser);

export default router;
