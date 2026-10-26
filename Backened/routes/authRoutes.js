const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const router = express.Router();

// ==========================================
// GOOGLE OAUTH CLIENT
// ==========================================

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// ==========================================
// JWT TOKEN HELPER
// ==========================================

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from .env");
  }

  return jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// ==========================================
// SIGNUP
// POST /api/auth/signup
// ==========================================

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Valid name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || "user",
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    console.error("Signup error:", error.message);

    return res.status(500).json({
      message: "Failed to create account",
    });
  }
});

// ==========================================
// EMAIL/PASSWORD LOGIN
// POST /api/auth/login
// ==========================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // password has select: false in User.js,
    // so explicitly select it for password login.
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const role = user.role || "user";

    if (!["user", "admin"].includes(role)) {
      return res.status(403).json({
        message: "Invalid account role",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed due to a server error",
    });
  }
});

// ==========================================
// GOOGLE LOGIN
// POST /api/auth/google
// ==========================================

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (
      typeof credential !== "string" ||
      !credential.trim()
    ) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.JWT_SECRET
    ) {
      console.error(
        "GOOGLE_CLIENT_ID or JWT_SECRET is missing"
      );

      return res.status(500).json({
        message: "Google login is not configured",
      });
    }

    // Verify the Google ID token on the backend.
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (
      !payload ||
      !payload.sub ||
      !payload.email ||
      payload.email_verified !== true
    ) {
      return res.status(401).json({
        message: "Google account could not be verified",
      });
    }

    const googleId = payload.sub;
    const normalizedEmail = payload.email.trim().toLowerCase();

    // 1. Find an account already linked to this Google ID.
    let user = await User.findOne({ googleId });

    if (!user) {
      // 2. Check whether this email already exists.
      user = await User.findOne({
        email: normalizedEmail,
      });

      if (user) {
        // Never silently link an existing password account
        // without an explicit account-linking process.
        if (user.googleId && user.googleId !== googleId) {
          return res.status(409).json({
            message:
              "This email is linked to another Google account",
          });
        }

        // Link an existing account only if it is already
        // a Google-only account without a password.
        // Existing password accounts must use their normal login.
        if (!user.googleId) {
          if (user.password) {
            return res.status(409).json({
              message:
                "An account with this email already exists. Please log in with your password first.",
            });
          }

          user.googleId = googleId;
          await user.save();
        }
      } else {
        // 3. Create a new Google-only account.
        user = await User.create({
          name:
            typeof payload.name === "string" &&
            payload.name.trim()
              ? payload.name.trim()
              : normalizedEmail.split("@")[0],
          email: normalizedEmail,
          googleId,
          role: "user",
        });
      }
    }

    const role = user.role || "user";

    if (!["user", "admin"].includes(role)) {
      return res.status(403).json({
        message: "Invalid account role",
      });
    }

    // 4. Issue the same JWT format as normal login.
    const token = generateToken(user);

    return res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email or Google ID already exists",
      });
    }

    console.error("Google login error:", error.message);

    return res.status(401).json({
      message: "Google authentication failed",
    });
  }
});

// ==========================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// ==========================================

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Valid email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    const message =
      "If an account exists with this email, a password reset link will be sent.";

    // Do not reveal whether an account exists.
    if (!user) {
      return res.status(200).json({ message });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      throw new Error("FRONTEND_URL is missing from .env");
    }

    const resetUrl =
      `${frontendUrl.replace(/\/+$/, "")}/reset-password/${resetToken}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset Your TaskManager Password",
        text: `Reset your password using this link within 15 minutes: ${resetUrl}`,
        html: `
          <h2>Password Reset</h2>
          <p>Click below to reset your TaskManager password.</p>
          <p>This link expires in 15 minutes.</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you did not request this, ignore this email.</p>
        `,
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      throw emailError;
    }

    return res.status(200).json({ message });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      message: "Unable to process password reset right now",
    });
  }
});

// ==========================================
// RESET PASSWORD
// POST /api/auth/reset-password/:token
// ==========================================

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful. Please log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      message: "Unable to reset password right now",
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;
