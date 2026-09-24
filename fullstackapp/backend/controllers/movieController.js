const movies = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi",
    rating: 8.8,
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into a CEO's mind.",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    rating: 9.0,
    description: "Batman faces the Joker, a criminal mastermind who seeks to plunge Gotham into chaos and prove that heroism can be corrupted.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Spirited Away",
    year: 2001,
    genre: "Animation",
    rating: 8.6,
    description: "A young girl finds herself in a mysterious world of spirits and must find a way to free herself and return home.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "The Matrix",
    year: 1999,
    genre: "Action",
    rating: 8.7,
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against AI.",
    image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Interstellar",
    year: 2014,
    genre: "Adventure",
    rating: 8.7,
    description: "A team of explorers travels through a wormhole to find a new home for humanity as Earth becomes uninhabitable.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Django Unchained",
    year: 2012,
    genre: "Drama",
    rating: 8.4,
    description: "A bounty hunter and a freed slave team up to rescue the slave's wife from a ruthless plantation owner.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80"
  }
];

const getAllMovies = (req, res) => {
  res.json(movies);
};

const getMovieById = (req, res) => {
  const movie = movies.find((item) => item.id === Number(req.params.id));

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  res.json(movie);
};

const createMovie = (req, res) => {
  const { title, year, genre, rating, description, image } = req.body;

  if (!title || !genre) {
    return res.status(400).json({ message: "Title and genre are required" });
  }

  const newMovie = {
    id: movies.length ? movies[movies.length - 1].id + 1 : 1,
    title,
    year: year || new Date().getFullYear(),
    genre,
    rating: rating || 0,
    description: description || "",
    image: image || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
};

const updateMovie = (req, res) => {
  const movieId = Number(req.params.id);
  const movieIndex = movies.findIndex((item) => item.id === movieId);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies[movieIndex] = {
    ...movies[movieIndex],
    ...req.body,
    id: movieId
  };

  res.json(movies[movieIndex]);
};

const deleteMovie = (req, res) => {
  const movieId = Number(req.params.id);
  const movieIndex = movies.findIndex((item) => item.id === movieId);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const [deletedMovie] = movies.splice(movieIndex, 1);
  res.json({ message: "Movie deleted", movie: deletedMovie });
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};
