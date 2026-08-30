import Movie from "../models/movie.js";
import {
  buildSafeRegex,
  parsePagination,
  parseSort,
  parseBoolean,
} from "../utils/queryHelpers.js";

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

/**
 * GET /movies/search
 *
 * Free-text search powered by MongoDB regex.
 *
 * Query params:
 *   q       (required) the text to look for
 *   fields  comma separated list: title,director,description,tags  (default: title,director)
 *   mode    contains | startsWith | endsWith | exact                (default: contains)
 *   page, limit, sortBy, order
 *
 * Example: /movies/search?q=star&fields=title,description&mode=startsWith
 */
export const searchMovies = async (req, res) => {
  try {
    const { q, fields, mode } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        message: "Query param 'q' is required",
      });
    }

    const searchableFields = ["title", "director", "description", "tags"];

    // Whitelist the fields so the client can't probe arbitrary paths.
    const selectedFields = (fields ? fields.split(",") : ["title", "director"])
      .map((f) => f.trim())
      .filter((f) => searchableFields.includes(f));

    if (selectedFields.length === 0) {
      return res.status(400).json({
        message: `Invalid 'fields'. Allowed: ${searchableFields.join(", ")}`,
      });
    }

    const regex = buildSafeRegex(q, mode);

    // $or => match the regex in ANY of the requested fields.
    // Note: on an array field like `tags`, Mongo matches if ANY element matches.
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

/**
 * GET /movies/filter
 *
 * Structured filtering: combines regex matching with range / exact operators.
 *
 * Query params:
 *   title, director   partial (regex) match
 *   genre             exact match, one or many: ?genre=Action,Drama
 *   tags              must contain ALL given tags: ?tags=90s,classic
 *   minRating/maxRating, minYear/maxYear, minViews
 *   isPublished       true | false
 *   from, to          releaseDate range (ISO dates)
 *   page, limit, sortBy, order
 *
 * Example: /movies/filter?genre=Action,Sci-Fi&minRating=7&minYear=2000&sortBy=rating&order=desc
 */
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

    // ---- regex (partial, case-insensitive) matches -------------------------
    if (title?.trim()) filter.title = buildSafeRegex(title);
    if (director?.trim()) filter.director = buildSafeRegex(director);

    // ---- exact / set matches ----------------------------------------------
    if (genre?.trim()) {
      const genres = genre
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);

      // $in => "genre is one of these"
      if (genres.length) filter.genre = { $in: genres };
    }

    if (tags?.trim()) {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      // $all => the document must contain EVERY tag (use $in for "any").
      if (tagList.length) filter.tags = { $all: tagList };
    }

    const published = parseBoolean(isPublished);
    if (published !== undefined) filter.isPublished = published;

    // ---- numeric ranges ----------------------------------------------------
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

    // ---- date range --------------------------------------------------------
    const dateRange = {};
    if (from && !Number.isNaN(Date.parse(from))) dateRange.$gte = new Date(from);
    if (to && !Number.isNaN(Date.parse(to))) dateRange.$lte = new Date(to);
    if (Object.keys(dateRange).length) filter.releaseDate = dateRange;

    const { page, limit, skip } = parsePagination(req.query);
    const sort = parseSort(req.query);

    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sort).skip(skip).limit(limit),
      Movie.countDocuments(filter),
    ]);

    res.status(200).json({
      filter, // handy while learning: shows the Mongo query that was built
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
