import express from "express";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("User Auth API");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
