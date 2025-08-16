import { addBookmark, removeBookmark } from "../utils/bookmarkToggle.js";

export const getBookmarks = async (req, res) => {
  try {
    res.status(200).json(req.user.movieBookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function toggleBookmark(req, res) {
  try {
    const userId = req.user._id;
    const bookmarkData = req.body;
    const { tmdb_id } = bookmarkData;

    if (!tmdb_id) {
      return res.status(400).json({ error: "tmdb_id is required" });
    }

    const exists = req.user.movieBookmarks.some((b) => b.tmdb_id === tmdb_id);

    let updatedUser, action;

    if (exists) {
      updatedUser = await removeBookmark(userId, tmdb_id);
      action = false;
    } else {
      updatedUser = await addBookmark(userId, bookmarkData);
      action = true;
    }

    res.json({
      action,
      movieBookmarks: updatedUser.movieBookmarks,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export const getMe = async (req, res) => {
  res.json(req.user);
};
