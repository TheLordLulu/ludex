import "./App.css";
import { Header } from "./components/Header/Header";
import { Pokedex } from "./components/Pokedex/Pokedex";
import { Search } from "./components/Search/Search";

function App() {
  return (
    <>
      <Header />
      <Search />
      <Pokedex />
    </>
  );
}

export default App;
