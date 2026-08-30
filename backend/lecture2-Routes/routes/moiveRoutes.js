import express from "express";
import {
  addMoive,
  deleteMovie,
  getAllMovies,
  getMovieById,
  updateMoive,
} from "../controllers/moiveControllers.js";
const router = express.Router();

router.get("/", getAllMovies);

router.get("/:id", getMovieById);

router.post("/", addMoive);

router.put("/:id", updateMoive);

router.delete("/:id", deleteMovie);

export default router;
