import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcryptjs";

const hashToken = async (token) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
};

const compareToken = async (token, hashedToken) => {
  return bcrypt.compare(token, hashedToken);
};

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES_IN,
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // ✅ Basic server-side validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Email check
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Password check (min 8 chars, at least 1 letter, 1 number)
  const isLongEnough = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  if (!isLongEnough || !hasLetter || !hasNumber) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain at least one letter and one number",
    });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Hash refresh token before storing
    const hashedRefresh = await hashToken(refreshToken);

    user.refreshTokens.push({
      token: hashedRefresh,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });
    await user.save();

    // Send refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // set to true in production with HTTPS
      sameSite: "None",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Hash refresh token with bcrypt before storing
    const hashedRefresh = await hashToken(refreshToken);

    user.refreshTokens.push({
      token: hashedRefresh,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });
    await user.save();

    // Send refresh token in secure cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // set to true in production with HTTPS
      sameSite: "None",
      path: "/", // send to all routes
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.sendStatus(404);

    // Check refresh token against DB stored hashes
    const match = await Promise.all(
      user.refreshTokens.map((rt) => compareToken(refreshToken, rt.token))
    ).then((results) => results.some(Boolean));

    if (!match) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.sendStatus(403);
  }
};

export const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      const newTokens = [];
      for (const rt of user.refreshTokens) {
        const match = await compareToken(refreshToken, rt.token);
        if (!match) newTokens.push(rt);
      }
      user.refreshTokens = newTokens;
      await user.save();
    }
  } catch (err) {
    // token invalid → ignore
  }

  // Clear cookie
  res.clearCookie("refreshToken", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.sendStatus(204);
};

export const logoutAll = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      // Clear all stored refresh tokens
      user.refreshTokens = [];
      await user.save();
    }
  } catch (err) {
    // token invalid → ignore
  }

  // Clear cookie
  res.clearCookie("refreshToken", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.sendStatus(204);
};
