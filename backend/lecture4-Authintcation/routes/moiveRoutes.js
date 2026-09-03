import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getAllMovies,
  getMovieById,
  searchMovies,
  filterMovies,
  addMoive,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getAllMovies);

router.get("/search", searchMovies);

router.get("/filter", filterMovies);

router.get("/:id", getMovieById);

router.post("/", authMiddleware, addMoive);

router.put("/:id", updateMovie);

router.delete("/:id", deleteMovie);

export default router;
