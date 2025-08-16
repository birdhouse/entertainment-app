import { User } from "../models/user.model.js";

// Add bookmark
export async function addBookmark(userId, bookmarkData) {
  try {
    const updatedBookmark = { ...bookmarkData, isBookmarked: true };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { movieBookmarks: updatedBookmark } }, // tmdb_id prevents duplicates
      { new: true }
    );

    return updatedUser;
  } catch (err) {
    console.error("Error adding bookmark:", err);
    throw err;
  }
}

export async function removeBookmark(userId, tmdb_id) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { movieBookmarks: { tmdb_id } } },
      { new: true }
    );

    return updatedUser;
  } catch (err) {
    console.error("Error removing bookmark:", err);
    throw err;
  }
}
