import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.AUTH_PORT || 4001;

connectDB();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ service: "auth-service", status: "ok" });
});

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service running on http://localhost:${PORT}`);
});
