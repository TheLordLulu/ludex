import { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        effort: unknown;
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
      base_experience: number; // Base experience field
  }

  interface SpeciesInfo {
    egg_groups: unknown;
    gender_rate: number;
    hatch_counter: ReactNode;
    genera: unknown;
    id: ReactNode;
    name: string;
    capture_rate: number;
    base_happiness: number;
    growth_rate: { name: string };
  }

  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo | null>(null);
  const [speciesInfo, setSpeciesInfo] = useState<SpeciesInfo | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<PokemonInfo | null>(null);

  useEffect(() => {
    const fetchPokemonInfo = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        setPokemonInfo(data);

        // Fetch species information, including the Pokédex entry, growth rate, capture rate, etc.
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

  const renderEVYields = (stats: { effort: number, stat: { name: string } }[]) => {
    if (!stats) return 'N/A';
    return stats
      .filter(stat => stat.effort > 0)
      .map(ev => `${ev.effort} ${ev.stat.name}`)
      .join(', ') || 'None';
  };

  return (
    <div className="bg-white flex flex-col items-center p-10 container mt-10">
      {pokemonInfo && speciesInfo && evolutionChain ? (
        <div className="container">
          <div className="font-bold text-4xl capitalize text-black mb-10">
            <h1>{pokemonInfo.name}</h1>
          </div>
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
                  <tr><td>Species:</td><td>{(speciesInfo.genera as { language: { name: string; }; genus: string; }[]).find(genus => genus.language.name === "en")?.genus}</td></tr>
                  <tr><td>Height:</td><td>{`${(pokemonInfo.height / 10).toFixed(1)} m (${Math.floor(pokemonInfo.height / 10 * 3.281)}'${Math.round((pokemonInfo.height / 10 * 3.281 % 1) * 12).toString().padStart(2, '0')}")`}</td></tr>
                  <tr><td>Weight:</td><td>{`${(pokemonInfo.weight / 10).toFixed(1)} kg (${(pokemonInfo.weight / 10 * 2.205).toFixed(1)} lbs)`}</td></tr>
                  <tr><td>Abilities:</td><td>{pokemonInfo.abilities.map(ability => ability.ability.name).join(', ')}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Training and Breeding Information */}
            <div className="grid-item training-breeding">
              <h2 className="font-bold text-xl text-black mb-4">Training</h2>
              <table className="table">
              <tbody>
                  <tr><td>Base Experience:</td><td>{pokemonInfo.base_experience}</td></tr>
                  <tr><td>EV Yields:</td><td>{renderEVYields(pokemonInfo.stats.map(stat => ({ effort: stat.effort as number, stat: stat.stat })))}</td></tr>
                  <tr><td>Catch Rate:</td><td>{speciesInfo.capture_rate}</td></tr>
                  <tr><td>Base Friendship:</td><td>{speciesInfo.base_happiness}</td></tr>
                  <tr><td>Growth Rate:</td><td>{speciesInfo.growth_rate.name}</td></tr>
                </tbody>
              </table>
              <h2 className="font-bold text-xl text-black mb-4">Breeding</h2>
              <table className="table">
              <tbody>
                  <tr><td>Egg Groups:</td><td>{(speciesInfo.egg_groups as { name: string }[]).map(group => group.name).join(', ')}</td></tr>
                  <tr><td>Gender:</td><td>{speciesInfo.gender_rate === -1 ? "Genderless" : `♂ ${(8 - speciesInfo.gender_rate) * 12.5}%, ♀ ${speciesInfo.gender_rate * 12.5}%`}</td></tr>
                  <tr><td>Egg Cycles:</td><td>{`${(speciesInfo.hatch_counter ?? 0) as number} (${((speciesInfo.hatch_counter ?? 0) as number) * 255} steps)`}</td></tr>
              </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
