import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PokemonTypes } from "../PokemonTypes/PokemonTypes.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePokemons } from "../../hooks/usePokemons";


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

const PokedexContent = () => {
  const { data: pokemons, isLoading, isError } = usePokemons();
  const [sortField, setSortField] = useState<string | null>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const filteredPokemons = useMemo(() => {
    if (!pokemons) return [];
    return pokemons.filter((pokemon) => {
      const matchesSearch = pokemon.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = selectedType
        ? pokemon.types.some((type) => type.type.name === selectedType)
        : true;
      return matchesSearch && matchesType;
    });
  }, [pokemons, search, selectedType]);

  const memoizedPokemonTypes = useMemo(() => pokemonTypes, []);

  const getSortedPokemons = () => {
    return filteredPokemons.slice().sort((a, b) => {
      if (sortField === "name") {
        const fieldA = a[sortField].toString().toLowerCase();
        const fieldB = b[sortField].toString().toLowerCase();
        if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      } else if (sortField === "id") {
        const idA = parseInt(a[sortField].toString());
        const idB = parseInt(b[sortField].toString());
        return sortOrder === "asc" ? idA - idB : idB - idA;
      } else if (sortField === "total") {
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
        const statA =
          a.stats.find((stat) => stat.stat.name === sortField)?.base_stat || 0;
        const statB =
          b.stats.find((stat) => stat.stat.name === sortField)?.base_stat || 0;
        return sortOrder === "asc" ? statA - statB : statB - statA;
      }
    });
  };

  const handleSort = debounce((field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }, 250);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>An error occurred</p>;

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
                <Link to={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
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
                <td
                  className="text-gray-800 font-semibold"
                  key={stat.stat.name}
                >
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
export const Pokedex = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PokedexContent />
    </QueryClientProvider>
  );
};
