let movies = [
  {
    id: 1,
    title: "Interstellar",
    rating: 9,
  },
  {
    id: 2,
    title: "Inception",
    rating: 8.8,
  },
  {
    id: 3,
    title: "The Dark Knight",
    rating: 9.1,
  },
];

export const getAllMovies = (req, res) => {
  res.status(200).json(movies);
};

export const getMovieById = (req, res) => {
  const id = Number(req.params.id);

  const movie = movies.find((movie) => movie.id === id);

  if (!movie) {
    return res.status(404).json({
      message: "Movie not found",
    });
  }

  res.status(200).json(movie);
};

export const addMoive = (req, res) => {
  const { title, rating } = req.body;

  if (!title || rating === undefined) {
    return res.status(400).json({
      message: "Title and rating are required",
    });
  }

  const newMovie = {
    id: movies.length + 1,
    title,
    rating,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
};

export const updateMoive = (req, res) => {
  const id = Number(req.params.id);

  const movie = movies.find((movie) => movie.id === id);

  if (!movie) {
    return res.status(404).json({
      message: "Movie not found",
    });
  }

  const { title, rating } = req.body;

  movie.title = title;
  movie.rating = rating;

  res.status(200).json(movie);
};

export const deleteMovie = (req, res) => {
  const id = Number(req.params.id);

  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({
      message: "Movie not found",
    });
  }

  movies.splice(movieIndex, 1);

  res.status(200).json({
    message: "Movie deleted successfully",
  });
};
