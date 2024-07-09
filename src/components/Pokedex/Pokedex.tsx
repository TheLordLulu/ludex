import React, { useEffect } from "react";
import { PokemonTypes } from "../PokemonTypes/PokemonTypes";

interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface Pokemon {
  sprites: {
    front_default: string;
  };
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  stats: Stat[];
}



export const Pokedex = () => {
  const [pokemons, setPokemons] = React.useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const data = await response.json();
      const detailedPokemonData = await Promise.all(
        data.results.map(async (pokemon) => {
          const response = await fetch(pokemon.url);
          const pokemonData = await response.json();
          const spriteResponse = await fetch(pokemonData.sprites.front_default);
          const spriteData = await spriteResponse.blob();
          const spriteUrl = URL.createObjectURL(spriteData);
          return { ...pokemonData, spriteUrl };
        })
      );
      setPokemons(detailedPokemonData);
    };
    fetchPokemon();
  }, []);

  return (
    <div className="bg-white">
      <table className="mx-auto">
        <thead className="text-black bg-[#747474]">
          <tr className="">
            <th className="p-2">Sprite</th> 
            <th className="p-2">Number</th>
            <th className="p-2">Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Total</th>
            <th className="p-2">HP</th>
            <th className="p-2">Attack</th>
            <th className="p-2">Defense</th>
            <th className="p-2">Sp.Atk</th>
            <th className="p-2">Sp.Def</th>
            <th className="p-2">Speed</th>
          </tr>
        </thead>
        <tbody>
          {pokemons.map((pokemon) => (
            <tr key={pokemon.id}>
              <td>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              </td>
              <td className="text-gray-700">{pokemon.id}</td>
              <td className="text-blue-500 capitalize font-bold ">{pokemon.name}</td>
              <td className="uppercase font-semibold"><PokemonTypes types={pokemon.types} /></td>
              <td className="text-black font-semibold">
                {pokemon.stats.reduce(
                  (total, stat) => total + stat.base_stat,
                  0
                )}
              </td>
              {pokemon.stats.map((stat) => (
                <td className="text-gray-500" key={stat.stat.name}>{stat.base_stat}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
