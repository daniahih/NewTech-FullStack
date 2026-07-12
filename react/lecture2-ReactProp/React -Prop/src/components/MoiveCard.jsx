export default function MoiveCard({ title, rating, year, isAvalible }) {
  return (
    <article className="movie-card">
      <h2>{title}</h2>
      <p>Rating: {rating} /10</p>
      <p>Year: {year}</p>
      {isAvalible ? <button> Avalible</button> : <button>Not Avalible</button>}
    </article>
  );
}
