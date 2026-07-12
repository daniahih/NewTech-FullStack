export default function MovieCard({ title, rating, year, isAvailable }) {
  return (
    <>
      <h2>{title}</h2>
      <p>rating {rating}</p>
      <p>year {year}</p>
      {isAvailable ? (
        <>
          <button>Available</button>
          <h1>Welcome back!</h1>
        </>
      ) : (
        <>
          <button>Not Available</button>
          <h1>Please sign in.</h1>
        </>
      )}
    </>
  );
}
