import express from "express";
import {
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;
