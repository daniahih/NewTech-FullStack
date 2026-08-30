import express from "express";
import dotenv from "dotenv";
import movieRoutes from "./routes/moiveRoutes.js";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use("/movies", movieRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
