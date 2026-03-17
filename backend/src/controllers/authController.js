const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { successResponse, errorResponse } = require("../utils/response");

// Helper: sign JWT and set HTTP-only cookie
const sendTokenCookie = (res, user) => {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return errorResponse(res, 409, "An account with this email already exists.");
    }

    // passwordHash field triggers bcrypt in the pre-save hook
    const user = await User.create({ name, email, passwordHash: password });

    sendTokenCookie(res, user);

    return successResponse(res, 201, "Registration successful", {
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    return errorResponse(res, 500, "Registration failed. Please try again.");
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // passwordHash is select: false — must explicitly include it
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return errorResponse(res, 401, "Invalid email or password.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, "Invalid email or password.");
    }

    sendTokenCookie(res, user);

    return successResponse(res, 200, "Login successful", {
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return errorResponse(res, 500, "Login failed. Please try again.");
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return successResponse(res, 200, "Logged out successfully");
};

// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return errorResponse(res, 404, "User not found.");
    return successResponse(res, 200, "User fetched", {
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return errorResponse(res, 500, "Could not fetch user.");
  }
};

module.exports = { register, login, logout, getMe };