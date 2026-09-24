import Movie from "../models/movie.js";
import {
  buildSafeRegex,
  parsePagination,
  parseSort,
  parseBoolean,
} from "../../utils/queryHelpers.js";

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
      createdBy: req.user._id,
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
    const { createdBy, ...updates } = req.body;
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      updates,
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

export const searchMovies = async (req, res) => {
  try {
    const { q, fields, mode } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        message: "Query param 'q' is required",
      });
    }

    const searchableFields = ["title", "director", "description", "tags"];
    const selectedFields = (fields ? fields.split(",") : ["title", "director"])
      .map((f) => f.trim())
      .filter((f) => searchableFields.includes(f));

    if (selectedFields.length === 0) {
      return res.status(400).json({
        message: `Invalid 'fields'. Allowed: ${searchableFields.join(", ")}`,
      });
    }

    const regex = buildSafeRegex(q, mode);
    const filter = { $or: selectedFields.map((f) => ({ [f]: regex })) };

    const { page, limit, skip } = parsePagination(req.query);
    const sort = parseSort(req.query);

    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sort).skip(skip).limit(limit),
      Movie.countDocuments(filter),
    ]);

    res.status(200).json({
      query: q,
      mode: mode || "contains",
      fields: selectedFields,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error searching movies",
      error: error.message,
    });
  }
};

export const filterMovies = async (req, res) => {
  try {
    const {
      title,
      director,
      genre,
      tags,
      minRating,
      maxRating,
      minYear,
      maxYear,
      minViews,
      isPublished,
      from,
      to,
    } = req.query;

    const filter = {};

    if (title?.trim()) filter.title = buildSafeRegex(title);
    if (director?.trim()) filter.director = buildSafeRegex(director);

    if (genre?.trim()) {
      const genres = genre
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);

      if (genres.length) filter.genre = { $in: genres };
    }

    if (tags?.trim()) {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (tagList.length) filter.tags = { $all: tagList };
    }

    const published = parseBoolean(isPublished);
    if (published !== undefined) filter.isPublished = published;

    const range = (min, max) => {
      const r = {};
      if (min !== undefined && !Number.isNaN(Number(min))) r.$gte = Number(min);
      if (max !== undefined && !Number.isNaN(Number(max))) r.$lte = Number(max);
      return Object.keys(r).length ? r : undefined;
    };

    const ratingRange = range(minRating, maxRating);
    if (ratingRange) filter.rating = ratingRange;

    const yearRange = range(minYear, maxYear);
    if (yearRange) filter.year = yearRange;

    const viewsRange = range(minViews, undefined);
    if (viewsRange) filter.views = viewsRange;

    const dateRange = {};
    if (from && !Number.isNaN(Date.parse(from)))
      dateRange.$gte = new Date(from);
    if (to && !Number.isNaN(Date.parse(to))) dateRange.$lte = new Date(to);
    if (Object.keys(dateRange).length) filter.releaseDate = dateRange;

    const { page, limit, skip } = parsePagination(req.query);
    const sort = parseSort(req.query);

    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sort).skip(skip).limit(limit),
      Movie.countDocuments(filter),
    ]);

    res.status(200).json({
      filter,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering movies",
      error: error.message,
    });
  }
};
