import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1> Counter:{count}</h1>
      <button
        onClick={() => {
          setCount(count + 7);
        }}
      >
        Click
      </button>
    </>
  );
}
