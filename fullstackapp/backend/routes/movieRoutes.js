const express = require("express");
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require("../controllers/movieController");
const { validateMovieId, validateMovieData } = require("../middleware/validateMovie");

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:id", validateMovieId, getMovieById);
router.post("/", validateMovieData, createMovie);
router.put("/:id", validateMovieId, validateMovieData, updateMovie);
router.delete("/:id", validateMovieId, deleteMovie);

module.exports = router;
