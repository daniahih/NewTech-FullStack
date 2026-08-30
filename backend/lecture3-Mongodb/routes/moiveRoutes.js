import express from "express";

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

// GET /movies
router.get("/", getAllMovies);

/**
 * IMPORTANT — route order matters in Express.
 * These static routes MUST be declared before "/:id", otherwise a request to
 * /movies/search would be matched by "/:id" with id === "search" and blow up
 * on the ObjectId cast.
 */

// GET /movies/search?q=star&fields=title,description&mode=contains
router.get("/search", searchMovies);

// GET /movies/filter?genre=Action&minRating=7&minYear=2000&sortBy=rating&order=desc
router.get("/filter", filterMovies);

// GET /movies/:id
router.get("/:id", getMovieById);

// POST /movies
router.post("/", addMoive);

// PUT /movies/:id
router.put("/:id", updateMovie);

// DELETE /movies/:id
router.delete("/:id", deleteMovie);

export default router;
