const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const { getUsers, getUser, updateUser } = require("../Controller/userController");

// Public: get all users
router.get("/", getUsers);

// Protected: get own profile
router.get("/profile", protect, getUser);

// Protected: update own profile
router.put("/profile", protect, updateUser);

module.exports = router;
