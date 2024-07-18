import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
    front_shiny: string;
  };
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  stats: Stat[];
}

// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (func: Function, delay: number) => {
  let timeout: number | undefined;
  return function executedFunction(...args: unknown[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};

interface SelectOptionProps {
  type: { type: { name: string } };
}

const SelectOption = React.memo(({ type }: SelectOptionProps) => {
  return (
    <option key={type.type.name} value={type.type.name}>
      {type.type.name}
    </option>
  );
});




export const Pokedex = () => {
  const [pokemons, setPokemons] = React.useState<Pokemon[]>([]);
  const [sortField, setSortField] = React.useState<string | null>("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pokemonTypes = [
    { type: { name: "normal" } },
    { type: { name: "fire" } },
    { type: { name: "water" } },
    { type: { name: "electric" } },
    { type: { name: "grass" } },
    { type: { name: "ice" } },
    { type: { name: "fighting" } },
    { type: { name: "poison" } },
    { type: { name: "ground" } },
    { type: { name: "psychic" } },
    { type: { name: "rock" } },
    { type: { name: "ghost" } },
    { type: { name: "dragon" } },
    { type: { name: "dark" } },
    { type: { name: "steel" } },
    { type: { name: "fairy" } },
    { type: { name: "bug" } },
    { type: { name: "flying" } },
  ];






  // fetch data from the pokeapi
  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const data = await response.json();

      // fetch detailed data for each pokemon
      const detailedPokemonData = await Promise.all(
        data.results.map(async (pokemon: { url: RequestInfo | URL }) => {
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

  useEffect(() => {
    // Filter pokemons whenever search or selectedType changes
    const filterPokemons = () => {
      const filtered = pokemons.filter((pokemon) => {
        const matchesSearch = pokemon.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesType = selectedType
          ? pokemon.types.some((type) => type.type.name === selectedType)
          : true;
        return matchesSearch && matchesType;
      });
      setFilteredPokemons(filtered);
    };

    filterPokemons();
  }, [search, selectedType, pokemons]);

  const memoizedPokemonTypes = useMemo(() => pokemonTypes, [pokemonTypes]);
  // sort the pokemons based on the sortField and sortOrder
  const getSortedPokemons = () => {
    return filteredPokemons.slice().sort((a, b) => {
      if (sortField === "name") {
        // for string fields, we need to convert them to lowercase
        const fieldA = a[sortField].toString().toLowerCase();
        const fieldB = b[sortField].toString().toLowerCase();
        if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      } else if (sortField === "id") {
        // Treat id as numeric value
        const idA = parseInt(a[sortField].toString());
        const idB = parseInt(b[sortField].toString());
        return sortOrder === "asc" ? idA - idB : idB - idA;
      } else if (sortField === "total") {
        // for total, we need to sum all stats
        const totalA = a.stats.reduce(
          (total, stat) => total + stat.base_stat,
          0
        );
        const totalB = b.stats.reduce(
          (total, stat) => total + stat.base_stat,
          0
        );
        return sortOrder === "asc" ? totalA - totalB : totalB - totalA;
      } else {
        // Handle sorting by specific stats
        const statA =
          a.stats.find((stat) => stat.stat.name === sortField)?.base_stat || 0;
        const statB =
          b.stats.find((stat) => stat.stat.name === sortField)?.base_stat || 0;
        return sortOrder === "asc" ? statA - statB : statB - statA;
      }
    });
  };

  // handle sorting when a column is clicked
  const handleSort = debounce((field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // if the field is different, we set the field and order to default
      setSortField(field);
      setSortOrder("asc");
    }
  }, 250);

  return (
    <div className="bg-white flex flex-col items-center p-10 container mt-10">
      <div className="flex items-center gap-3 w-1/3 p-5 container ">
        <input
          type="text"
          className="input input-ghost input-sm  grow "
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className=" form-select  capitalize"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Types</option>
          {memoizedPokemonTypes.map((type) => (
            <SelectOption key={type.type.name} type={type} />
          ))}
        </select>
      </div>
      <table className="table-bordered table-info table-lg w-full ">
        <thead className="text-black bg-[#bcbbbb]  ">
          <tr className="">
            <th className="p-2">Sprite</th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("id")}>
              Number
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name
            </th>
            <th className="p-2">Type</th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("total")}
            >
              Total
            </th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort("hp")}>
              HP
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("attack")}
            >
              Attack
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("defense")}
            >
              Defense
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("special-attack")}
            >
              Sp.Atk
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("special-defense")}
            >
              Sp.Def
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("speed")}
            >
              Speed
            </th>
          </tr>
        </thead>
        <tbody className="">
          {getSortedPokemons().map((pokemon) => (
            <tr key={pokemon.id} className="">
              <td>
                <img
                  src={pokemon.sprites.front_shiny}
                  alt={pokemon.name}
                  loading="lazy"
                />
              </td>
              <td className="text-gray-800 font-semibold">{pokemon.id}</td>
              <td className="text-blue-500 capitalize font-bold ">
              <Link to={`/pokemon/${pokemon.name}`}>
                {pokemon.name}
              </Link>
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
                <td className="text-gray-800 font-semibold" key={stat.stat.name}>
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
