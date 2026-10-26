
const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    // Step 1: Check karo ke authenticated user ki ID available hai
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    // Step 2: MongoDB se current user find karo
    const user = await User.findById(req.user.userId).select("role");

    // Step 3: Check karo ke user exist karta hai ya nahi
    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    // Step 4: Check karo ke user admin hai ya nahi
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin permission required.",
      });
    }

    // Step 5: User admin hai, request aage proceed karo
    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);

    return res.status(500).json({
      message: "Server error while verifying admin permissions.",
    });
  }
};

module.exports = adminMiddleware;
