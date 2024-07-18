import React, { useEffect, useState, useCallback } from 'react';

interface EvolutionChain {
  chain: {
    evolves_to: Array<{
      species: { name: string };
      evolution_details: Array<{ min_level?: number }>;
    }>;
    species: { name: string };
  };
}

const PokemonEvolution = ({ pokemonName }: { pokemonName: string }) => {
  const [evolutionStages, setEvolutionStages] = useState<{ name: string; spriteUrl: string; level?: number }[]>([]);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);

  const fetchPokemonSprite = async (pokemonName: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await response.json();
      return data.sprites.front_default;
    } catch (error) {
      console.error("Failed to fetch pokemon sprite", error);
      return null;
    }
  };

  const parseEvolutionChain = useCallback(async (evolutionChain: EvolutionChain) => {
    let evoData = evolutionChain.chain;
    const evolutionStages = [];

    do {
      const numberOfEvolutions = evoData.evolves_to.length;
      const pokemonName = evoData.species.name;
      const spriteUrl = await fetchPokemonSprite(pokemonName);
    
      const evolutionDetails = evoData.evolves_to[0]?.evolution_details[0];
      const level = evolutionDetails?.min_level;
    
      evolutionStages.push({ name: pokemonName, spriteUrl, level });
    
      // Assuming only one path of evolution for simplicity
      evoData = numberOfEvolutions > 0 ? evoData.evolves_to[0] : { evolves_to: [] };
    
    } while (!!evoData && Object.prototype.hasOwnProperty.call(evoData, 'evolves_to'));

    return evolutionStages;
  }, []);

  useEffect(() => {
    if (evolutionChain) {
      parseEvolutionChain(evolutionChain).then(setEvolutionStages);
    }
  }, [evolutionChain]);

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      try {
        // Fetch the species data
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`);
        if (!speciesResponse.ok) {
          throw new Error(`Failed to fetch species data: ${speciesResponse.status} ${speciesResponse.statusText}`);
        }
        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;
  
        // Fetch the evolution chain data
        const evolutionResponse = await fetch(evolutionChainUrl);
        if (!evolutionResponse.ok) {
          throw new Error(`Failed to fetch evolution chain data: ${evolutionResponse.status} ${evolutionResponse.statusText}`);
        }
        const evolutionData = await evolutionResponse.json();
  
        // Update the state with the fetched evolution chain data
        setEvolutionChain(evolutionData);
      } catch (error) {
        console.error("Failed to fetch evolution chain", error);
      }
    };
  
    fetchEvolutionChain();
  }, [pokemonName]);

  return (
    <div>
      <div className="evolution-chain">
        {evolutionStages.map((stage, index) => (
          <React.Fragment key={stage.name}>
            <div className="pokemon-stage">
              <img src={stage.spriteUrl} alt={stage.name} />
              <p>{stage.name}</p>
            </div>
            {index < evolutionStages.length - 1 && (
              <div className="evolution-step">
                <span className="arrow">→</span>
                {stage.level && <span className="level">Lvl {stage.level}</span>}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PokemonEvolution;