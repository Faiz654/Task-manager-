
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET LOGGED-IN USER PROFILE
// GET /api/users/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error.message);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// UPDATE PROFILE
// PUT /api/users/profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, location, bio } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message: "Name and email are required.",
      });
    }

    if (bio !== undefined && typeof bio !== "string") {
      return res.status(400).json({ message: "Invalid bio." });
    }

    if (bio && bio.length > 300) {
      return res.status(400).json({
        message: "Bio cannot exceed 300 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user.userId },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "This email is already in use.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: {
          name: name.trim(),
          email: normalizedEmail,
          phone: typeof phone === "string" ? phone.trim() : "",
          location:
            typeof location === "string" ? location.trim() : "",
          bio: typeof bio === "string" ? bio.trim() : "",
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({
      message: "Failed to update profile.",
    });
  }
});

// UPDATE PASSWORD
// PUT /api/users/password
router.put("/password", authMiddleware, async (req, res) => {
  try {
    const { current, newPassword, confirm } = req.body;

    if (!current || !newPassword || !confirm) {
      return res.status(400).json({
        message: "All password fields are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters.",
      });
    }

    if (newPassword !== confirm) {
      return res.status(400).json({
        message: "New password and confirmation do not match.",
      });
    }

    if (current === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password.",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(current, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Update password error:", error.message);
    return res.status(500).json({
      message: "Failed to update password.",
    });
  }
});

module.exports = router;
