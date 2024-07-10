import React, { useEffect, useState } from "react";
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
  const [sortField, setSortField] = React.useState<string | null>("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");


  // fetch data from the pokeapi
  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const data = await response.json();

      // fetch detailed data for each pokemon
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


  // sort the pokemons based on the sortField and sortOrder
  const getSortedPokemons = () => {
    return pokemons.slice().sort((a, b) => {
      if (sortField === "name") {
        // for string fields, we need to convert them to lowercase
        const fieldA = a[sortField].toString().toLowerCase();
        const fieldB = b[sortField].toString().toLowerCase();
        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      } else if (sortField === "id") {
        // Treat id as numeric value
        const idA = parseInt(a[sortField].toString());
        const idB = parseInt(b[sortField].toString());
        return sortOrder === 'asc' ? idA - idB : idB - idA;
      } else if (sortField === "total") {
        // for total, we need to sum all stats
        const totalA = a.stats.reduce((total, stat) => total + stat.base_stat, 0);
        const totalB = b.stats.reduce((total, stat) => total + stat.base_stat, 0);
        return sortOrder === 'asc' ? totalA - totalB : totalB - totalA;
      } else {
        // for other stats, we need to find the stat by name
        const statA = a.stats.find(stat => stat.stat.name === sortField)?.base_stat || 0;
        const statB = b.stats.find(stat => stat.stat.name === sortField)?.base_stat || 0;
        return sortOrder === 'asc' ? statA - statB : statB - statA;
      }
    });
  };

  // handle sorting when a column is clicked
  const handleSort = (field: string) => {
    if (sortField === field) { //
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else { // if the field is different, we set the field and order to default
      setSortField(field);
      setSortOrder("asc");
    }
  }

  return (
    <div className="bg-white">
      <table className="mx-auto">
        <thead className="text-black bg-[#747474]">
          <tr className="">
            <th className="p-2">Sprite</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('id')}>Number</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
            <th className="p-2">Type</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('total')}>Total</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('hp')}>HP</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('attack')}>Attack</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('defense')}>Defense</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('special-attack')}>Sp.Atk</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('special-defense')}>Sp.Def</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('speed')}>Speed</th>
          </tr>
        </thead>
        <tbody>
          {getSortedPokemons().map((pokemon) => (
            <tr key={pokemon.id}>
              <td>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              </td>
              <td className="text-gray-700">{pokemon.id}</td>
              <td className="text-blue-500 capitalize font-bold ">
                {pokemon.name}
              </td>
              <td className="uppercase font-semibold">
                <PokemonTypes types={pokemon.types} />
              </td>
              <td className="text-black font-semibold">
                {pokemon.stats.reduce(
                  (total, stat) => total + stat.base_stat,
                  0
                )}
              </td>
              {pokemon.stats.map((stat) => (
                <td className="text-gray-500" key={stat.stat.name}>
                  {stat.base_stat}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
