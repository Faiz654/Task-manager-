
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Database connection
const connectDB = require("./config/db.js");

// Authentication routes
const authRoutes = require("./routes/authRoutes.js");

//Taskroutes 


const taskRoutes = require("./routes/taskRoutes.js");
// userroutes

const userRoutes = require("./routes/userRoutes.js");
//admin routes
const adminRoutes = require("./routes/adminRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());


// users routes 

app.use("/api/users", userRoutes);
// Authentication API routes
app.use("/api/auth", authRoutes);

//Tasks api routes
app.use("/api/tasks", taskRoutes);
//admin api routes

app.use("/api/admin", adminRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Task Manager Backend is running!");
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
