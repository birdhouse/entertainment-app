import { User } from "../models/user.model.js";
import { addBookmark, removeBookmark } from "../utils/bookmarkToggle.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get moviie bookmarks
export const getBookmarks = async (req, res) => {
  try {
    res.status(200).json(req.user.movieBookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function toggleBookmark(req, res) {
  try {
    const userId = req.user._id; // from protect middleware
    const bookmarkData = req.body; // only bookmark info is sent in request
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
    console.log("Error toggling bookmark:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export const updateUser = async (req, res) => {
  const { name, email, password, movieBookmarks } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password, movieBookmarks },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};
