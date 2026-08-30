import Movie from "../models/movie.js";

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message: "Error getting movies",
      error: error.message,
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    console.log(movie);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Error getting movies",
      error: error.message,
    });
  }
};

export const addMoive = async (req, res) => {
  try {
    const {
      title,
      rating,
      genre,
      year,
      director,
      description,
      isPublished,
      views,
      tags,
      releaseDate,
    } = req.body;

    if (!title || rating === undefined) {
      return res.status(400).json({
        message: "Title and rating are required",
      });
    }

    const newMovie = await Movie.create({
      title,
      rating,
      genre,
      year,
      director,
      description,
      isPublished,
      views,
      tags,
      releaseDate,
    });
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({
      message: "Error creating movie",
      error: error.message,
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,

      req.body,

      {
        new: true,

        runValidators: true,
      },
    );

    if (!updatedMovie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(400).json({
      message: "Error updating movie",
      error: error.message,
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json({
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting movie",
      error: error.message,
    });
  }
};
