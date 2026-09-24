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
import {
  authrizationMiddleWare,
  adminOrMovieOwner,
} from "../middleware/authrizationMiddleWare.js";

const router = express.Router();

router.get("/", getAllMovies);

router.get("/search", searchMovies);

router.get("/filter", filterMovies);

router.get("/:id", getMovieById);

router.post(
  "/",
  authMiddleware,
  authrizationMiddleWare("admin", "user"),
  addMoive,
);

router.put("/:id", authMiddleware, adminOrMovieOwner, updateMovie);

router.delete("/:id", authMiddleware, adminOrMovieOwner, deleteMovie);

export default router;
