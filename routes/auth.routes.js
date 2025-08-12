import express from "express";
import {
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
  logoutAll,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.post("/logoutAll", logoutAll);

export default router;
