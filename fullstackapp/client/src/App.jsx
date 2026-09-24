import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("http://localhost:5000/api/movies");
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="container">
          <h1>Movie Collection</h1>
        </div>
      </header>

      <main className="container">
        <section className="movie-grid">
          {movies.map((movie) => (
            <article key={movie.id} className="movie-card">
              <img src={movie.image} alt={`${movie.title} poster`} />
              <div className="movie-info">
                <div className="movie-topline">
                  <h2>{movie.title}</h2>
                  <span className="movie-rating">★ {movie.rating}</span>
                </div>
                <div className="movie-meta">
                  {movie.genre} • {movie.year}
                </div>
                <p>{movie.description}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
