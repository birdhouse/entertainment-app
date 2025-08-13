import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  userAgent: String,
  ip: String,
});

const MovieBookmarkSchema = new mongoose.Schema({
  tmdb_id: { type: Number, required: true }, // Unique ID from TMDB
  poster_path: { type: String, required: true },
  release_date: { type: String }, // format: "YYYY-MM-DD"
  first_air_date: { type: String }, // format: "YYYY-MM-DD"
  media_type: { type: String, enum: ["movie", "tv"], required: true },
  adult: { type: Boolean, default: false },
  original_title: { type: String },
  original_name: { type: String },
  isBookmarked: { type: Boolean },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    movieBookmarks: {
      type: [MovieBookmarkSchema],
      default: [],
    },
    refreshTokens: {
      type: [RefreshTokenSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
