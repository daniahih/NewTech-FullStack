import MoiveCard from "../../React -Prop/src/components/MoiveCard";
import movies from "./data/data";
function App() {
  return (
    <div>
      <h1>Movies</h1>
      {movies.map((movie) => {
        return (
          <MoiveCard
            key={movie.id}
            title={movie.title}
            rating={movie.rating}
            year={movie.year}
            isAvalible={movie.isAvailable}
          />
        );
      })}
    </div>
  );
}

export default App;
