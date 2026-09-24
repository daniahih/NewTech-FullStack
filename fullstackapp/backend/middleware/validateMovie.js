const validateMovieId = (req, res, next) => {
  const movieId = Number(req.params.id);

  if (Number.isNaN(movieId) || movieId <= 0) {
    return res.status(400).json({ message: "Invalid movie id" });
  }

  next();
};

const validateMovieData = (req, res, next) => {
  const { title, genre } = req.body;

  if (!title || !genre) {
    return res.status(400).json({ message: "Title and genre are required" });
  }

  next();
};

module.exports = { validateMovieId, validateMovieData };
