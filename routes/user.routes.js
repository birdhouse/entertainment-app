import express from "express";
import { getBookmarks, getMe, toggleBookmark } from "../controllers/user.controller.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);

router.get("/bookmarks", protect, getBookmarks);

router.put("/bookmarks", protect, toggleBookmark);

export default router;
