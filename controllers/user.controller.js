import { User } from "../models/user.model.js";

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

// update movie bookmarks
export const updateUserBookmarks = async (req, res) => {
  const { movieBookmarks } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { movieBookmarks },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser.movieBookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/user.controller.js
// export const replaceUserBookmarks = async (req, res) => {
//   const { movieBookmarks } = req.body;

//   if (!Array.isArray(movieBookmarks)) {
//     return res.status(400).json({ message: "movieBookmarks must be an array" });
//   }

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       { movieBookmarks },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(updatedUser.movieBookmarks);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const replaceUserBookmarks = async (req, res) => {
  const { movieBookmarks } = req.body;

  if (!Array.isArray(movieBookmarks)) {
    return res.status(400).json({ message: "movieBookmarks must be an array" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // Use user from token
      { movieBookmarks },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser.movieBookmarks);
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
