import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  getBookmarks,
  replaceUserBookmarks,
  deleteUser,
  getMe,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// not needed
router.get("/", getUsers);

// not needed
router.get("/me", protect, getMe);

router.get("/bookmark", protect, getBookmarks);

router.put("/bookmarks", protect, replaceUserBookmarks);

// not needed
router.get("/:id", getUserById);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
