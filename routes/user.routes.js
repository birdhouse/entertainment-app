import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  getBookmarks,
  deleteUser,
  getMe,
  toggleBookmark,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// not needed
router.get("/", getUsers);

// not needed
router.get("/me", protect, getMe);

router.get("/bookmarks", protect, getBookmarks);

router.put("/bookmarks", protect, toggleBookmark);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// not needed
router.get("/:id", getUserById);

export default router;
