import { useEffect, useState } from "react";
import "./App.css";

function App() {
  interface Pokemon {
    name: string;
    sprites: {
      front_default: string;
    };
    types: {
      type: {
        name: string;
      };
    }[];
  }
  
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((response) => response.json())
      .then((data) => {
        const promises = data.results.map((pokemon: { url: string }) =>
          fetch(pokemon.url).then((response) => response.json())
        );
        Promise.all(promises).then((pokemonDetails) => {
          setPokemon(pokemonDetails);
        });
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);
  return (
    <>
      <div className="">
        <h1>Pokedex</h1>
        <ul>
          {pokemon.map((pokemon) => (
            <li key={pokemon.name}>
              {pokemon.name}
              <img src={pokemon.sprites.front_default}  alt={pokemon.name} />
              <p>Type: {pokemon.types.map((type) => type.type.name).join(", ")}</p>
              </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
