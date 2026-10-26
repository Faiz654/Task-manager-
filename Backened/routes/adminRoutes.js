
const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/User");
const Task = require("../models/Task");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Apply authentication and admin permission to all routes below
router.use(authMiddleware, adminMiddleware);

// ========================================
// GET ALL USERS
// GET /api/admin/users
// ========================================
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const taskCounts = await Task.aggregate([
      {
        $group: {
          _id: "$user",
          totalTasks: { $sum: 1 },
        },
      },
    ]);

    const taskCountMap = new Map(
      taskCounts.map((item) => [String(item._id), item.totalTasks])
    );

    const usersWithTaskCounts = users.map((user) => ({
      ...user,
      totalTasks: taskCountMap.get(String(user._id)) || 0,
    }));

    return res.status(200).json({
      message: "Users fetched successfully",
      users: usersWithTaskCounts,
    });
  } catch (error) {
    console.error("Admin get users error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

// ========================================
// GET ALL TASKS FROM ALL USERS
// GET /api/admin/tasks
// ========================================
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "All tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    console.error("Admin get tasks error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

// ========================================
// PROMOTE A USER TO ADMIN
// PATCH /api/admin/users/:id/role
// Body: { "role": "admin" } or { "role": "user" }
// ========================================
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Role must be either user or admin",
      });
    }

    // Prevent an admin from accidentally changing their own role
    if (String(req.user.userId) === String(id)) {
      return res.status(400).json({
        message: "You cannot change your own role",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { role } },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message:
        role === "admin"
          ? "User promoted to admin successfully"
          : "Admin role removed successfully",
      user,
    });
  } catch (error) {
    console.error("Admin update role error:", error.message);

    return res.status(500).json({
      message: "Failed to update user role",
    });
  }
});

// ========================================
// HIDE OR UNHIDE A TASK
// PATCH /api/admin/tasks/:id/visibility
// Body: { "isHidden": true } or { "isHidden": false }
// ========================================
router.patch("/tasks/:id/visibility", async (req, res) => {
  try {
    const { id } = req.params;
    const { isHidden } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    if (typeof isHidden !== "boolean") {
      return res.status(400).json({
        message: "isHidden must be true or false",
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { $set: { isHidden } },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: isHidden
        ? "Task hidden successfully"
        : "Task unhidden successfully",
      task,
    });
  } catch (error) {
    console.error("Admin task visibility error:", error.message);

    return res.status(500).json({
      message: "Failed to update task visibility",
    });
  }
});

module.exports = router;
