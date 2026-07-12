import "./App.css";
import Card from "./components/card/Card";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Navbar from "./components/navbar/Navbar";

export default function App() {
  let display = false;

  return (
    <>
      <Navbar />

      {display ? <Card /> : <Main />}

      <Footer />
    </>
  );
}
