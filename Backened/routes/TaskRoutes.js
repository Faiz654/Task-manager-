
const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const validPriorities = ["Low", "Medium", "High"];
const validStatuses = ["Pending", "In Progress", "Completed"];

// ==========================================
// CREATE TASK
// POST /api/tasks
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    // Validate title
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    // Validate priority
    if (priority !== undefined && !validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid task priority",
      });
    }

    // Validate status
    if (status !== undefined && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    // Validate description
    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({
        message: "Invalid task description",
      });
    }

    // Validate due date
    let parsedDueDate = null;

    if (dueDate) {
      parsedDueDate = new Date(dueDate);

      if (Number.isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({
          message: "Invalid due date",
        });
      }
    }

    const taskStatus = status || "Pending";

    // Create task
    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      priority: priority || "Medium",
      status: taskStatus,
      dueDate: parsedDueDate,
      completed: taskStatus === "Completed",
      user: req.user.userId,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error.message);

    return res.status(500).json({
      message: "Failed to create task",
    });
  }
});

// ==========================================
// GET VISIBLE TASKS FOR LOGGED-IN USER
// GET /api/tasks
// Hidden tasks are excluded
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.userId,
      isHidden: { $ne: true },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

// ==========================================
// UPDATE TASK
// PUT /api/tasks/:id
// ==========================================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const updates = {};

    // Validate and update title
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Task title is required",
        });
      }

      updates.title = title.trim();
    }

    // Validate and update description
    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          message: "Invalid task description",
        });
      }

      updates.description = description.trim();
    }

    // Validate and update priority
    if (priority !== undefined) {
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          message: "Invalid task priority",
        });
      }

      updates.priority = priority;
    }

    // Validate and update status
    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid task status",
        });
      }

      updates.status = status;
      updates.completed = status === "Completed";
    }

    // Validate and update due date
    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === "") {
        updates.dueDate = null;
      } else {
        const parsedDate = new Date(dueDate);

        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            message: "Invalid due date",
          });
        }

        updates.dueDate = parsedDate;
      }
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    console.error("Update task error:", error.message);

    return res.status(500).json({
      message: "Failed to update task",
    });
  }
});

// ==========================================
// DELETE TASK
// DELETE /api/tasks/:id
// ==========================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    console.error("Delete task error:", error.message);

    return res.status(500).json({
      message: "Failed to delete task",
    });
  }
});

module.exports = router;
