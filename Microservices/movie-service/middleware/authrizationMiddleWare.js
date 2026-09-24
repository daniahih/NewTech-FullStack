import Movie from "../models/movie.js";

export const authrizationMiddleWare =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "you dont have permissions",
      });
    }
    next();
  };

export const adminOrMovieOwner = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = movie.createdBy && movie.createdBy.equals(req.user._id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "You can only modify your own movies",
      });
    }

    req.movie = movie;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid movie id" });
  }
};
