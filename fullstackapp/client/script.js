const movieGrid = document.getElementById("movieGrid");

async function loadMovies() {
  try {
    const response = await fetch("/api/movies");
    if (!response.ok) {
      throw new Error("Failed to load movies");
    }

    const movies = await response.json();

    movieGrid.innerHTML = movies
      .map(
        (movie) => `
          <article class="movie-card">
            <img src="${movie.image}" alt="${movie.title} poster" />
            <div class="movie-info">
              <div class="movie-topline">
                <h2 class="movie-title">${movie.title}</h2>
                <span class="movie-rating">★ ${movie.rating}</span>
              </div>
              <div class="movie-meta">${movie.genre} • ${movie.year}</div>
              <p class="movie-description">${movie.description}</p>
            </div>
          </article>
        `
      )
      .join("");
  } catch (error) {
    movieGrid.innerHTML = `<p>Unable to load movies right now.</p>`;
    console.error(error);
  }
}

loadMovies();
