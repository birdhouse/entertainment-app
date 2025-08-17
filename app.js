import express from "express";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "https://entertainment-app-fe.netlify.app",
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("User Auth API");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
