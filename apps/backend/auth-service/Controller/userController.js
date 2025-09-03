const User = require("../Model/userModel");
const bcrypt = require("bcryptjs");

// Get all users
const getUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
};

// Get single user profile
const getUser = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};

// Update user profile
const updateUser = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, email, password, role } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({
        message: "Profile updated successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
};

module.exports = { getUsers, getUser, updateUser };
