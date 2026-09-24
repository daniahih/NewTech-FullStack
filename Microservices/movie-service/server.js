import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import movieRoutes from "./routes/moiveRoutes.js";
import { startConsumer } from "../kafka/index.js";

dotenv.config();

const app = express();
const PORT = process.env.MOVIE_PORT || 4002;

connectDB();

startConsumer({
  groupId: "movie-service-group",
  topic: "user-events",
  onMessage: async (event) => {
    if (event?.type === "user.registered") {
      console.log("User registered event received by movie service:", event.user.email);
    }

    if (event?.type === "user.logged-in") {
      console.log("User login event received by movie service:", event.user.email);
    }
  },
  fromBeginning: false,
}).catch((error) => {
  console.error("Kafka consumer failed to start:", error.message);
});

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ service: "movie-service", status: "ok" });
});

app.use("/movies", movieRoutes);

app.listen(PORT, () => {
  console.log(`Movie service running on http://localhost:${PORT}`);
});
