import { User } from "../models/user.model.js";

// Add bookmark
export async function addBookmark(userId, bookmarkData) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { movieBookmarks: bookmarkData } }, // tmdb_id prevents duplicates
      { new: true }
    );
    console.log("Bookmark added:", updatedUser.movieBookmarks);
    return updatedUser;
  } catch (err) {
    console.error("Error adding bookmark:", err);
    throw err;
  }
}

// Remove bookmark by tmdb_id
export async function removeBookmark(userId, tmdb_id) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { movieBookmarks: { tmdb_id } } },
      { new: true }
    );
    console.log("Bookmark removed:", updatedUser.movieBookmarks);
    return updatedUser;
  } catch (err) {
    console.error("Error removing bookmark:", err);
    throw err;
  }
}
