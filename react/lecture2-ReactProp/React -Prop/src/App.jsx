import MoiveCard from "./components/MoiveCard";

function App() {
  return (
    <div>
      <h1>Movies</h1>
      <MoiveCard title="Inception" rating={9} year={2010} isAvalible={true} />
      <MoiveCard
        title="Interstellar"
        rating={8.7}
        year={2014}
        isAvalible={false}
      />
      <MoiveCard
        title="The Dark Knight"
        rating={9.2}
        year={2008}
        isAvalible={true}
      />
    </div>
  );
}

export default App;
