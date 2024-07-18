import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Pokedex } from "./components/Pokedex/Pokedex";
import { PokeInfo } from "./components/PokeInfo/PokeInfo";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokemon/:name" element={<PokeInfo />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;


