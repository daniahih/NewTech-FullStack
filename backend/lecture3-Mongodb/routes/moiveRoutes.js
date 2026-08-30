import express from "express";

import {
  getAllMovies,
  getMovieById,
  addMoive,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const router = express.Router();

// GET /movies
router.get("/", getAllMovies);

// GET /movies/:id
router.get("/:id", getMovieById);

// POST /movies
router.post("/", addMoive);

// PUT /movies/:id
router.put("/:id", updateMovie);

// DELETE /movies/:id
router.delete("/:id", deleteMovie);

export default router;
