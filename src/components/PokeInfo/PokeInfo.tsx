import { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import PokemonEvolution from "./PokemonEvolution";

export const PokeInfo = () => {
  const { name } = useParams<{ name: string }>();

  interface PokemonInfo {
      types: { type: { name: string } }[];
      genera: {
          language: { name: string }; type: { name: string }; genus: string;
      }[];
      abilities: {
          ability: { name: string }; type: { name: string };
      }[];
      stats: {
          stat: { name: string };
          base_stat: number; type: { name: string };
      }[];
      id: ReactNode;
      name: string;
      sprites: {
          [x: string]: unknown;
          front_default: string;
      };
      height: number;
      weight: number;
  }
  
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo | null>(null);
  const [speciesInfo, setSpeciesInfo] = useState<PokemonInfo | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<PokemonInfo | null>(
    null
  );

  useEffect(() => {
    const fetchPokemonInfo = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        const data = await response.json();
        setPokemonInfo(data);

        // Fetch species information, including the Pokédex entry
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        setSpeciesInfo(speciesData);

        // Fetch evolution chain
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        setEvolutionChain(evolutionData);

      } catch (error) {
        console.error("Failed to fetch pokemon info", error);
      }
    };

    if (name) {
      fetchPokemonInfo();
    }
  }, [name]);



  return (
    <div className="bg-white flex flex-col items-center p-10 container mt-10">
       {pokemonInfo && speciesInfo && evolutionChain ? (
  <div className="container">
  <div className="font-bold text-4xl capitalize text-black mb-10"><h1>{pokemonInfo.name}</h1></div>
  <div className="grid-container">
    {/* Pokemon Sprite */}
    <div className="grid-item sprite">
      <img src={(pokemonInfo?.sprites.other as { 'official-artwork': { front_default: string } })?.['official-artwork'].front_default} alt={pokemonInfo.name} />
    </div>

    {/* Pokemon Information Table */}
    <div className="grid-item info">
        <h2 className="font-bold text-xl text-black mb-4">Pokemon Data</h2>
      <table className="table ">
        <tbody>
          <tr><td>Dex Number:</td><td>{speciesInfo.id}</td></tr>
          <tr><td>Type:</td><td>{pokemonInfo.types.map(type => type.type.name).join(', ')}</td></tr>
          <tr><td>Species:</td><td>{speciesInfo.genera.find(genus => genus.language.name === "en")?.genus}</td></tr>
          <tr><td>Height:</td><td>{pokemonInfo.height}</td></tr>
          <tr><td>Weight:</td><td>{pokemonInfo.weight}</td></tr>
          <tr><td>Abilities:</td><td>{pokemonInfo.abilities.map(ability => ability.ability.name).join(', ')}</td></tr>
        </tbody>
      </table>
    </div>

    {/* Training and Breeding Information (Placeholder) */}
    <div className="grid-item training-breeding">
      <h2>Training Information</h2>
      {/* Placeholder for training information */}
      <h2>Breeding Information</h2>
      {/* Placeholder for breeding information */}
    </div>
  </div>
</div>
    ) : (
      <p>Loading...</p>
    )}


{/* <div>
        <h2>Base Stats:</h2>
        <table>
          <tbody>
            {pokemonInfo.stats.map(stat => (
              <tr key={stat.stat.name}><td>{stat.stat.name}:</td><td>{stat.base_stat}</td></tr>
            ))}
          </tbody>
        </table>
      </div> */}



    </div>
  );
};
