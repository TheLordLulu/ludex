import { useQuery } from '@tanstack/react-query'

const fetchPokemonList = async () => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
  const data = await response.json()
  return data.results
}

const fetchPokemonDetails = async (url) => {
    const response = await fetch(url);
    const pokemonData = await response.json();
    const spriteResponse = await fetch(pokemonData.sprites.front_default);
    const spriteData = await spriteResponse.blob();
    const spriteUrl = URL.createObjectURL(spriteData);
    return { ...pokemonData, spriteUrl };
}

export const usePokemons = () => {
    return useQuery({
      queryKey: ['pokemons'],
      queryFn: async () => {
        const pokemonList = await fetchPokemonList();
        const detailedPokemonData = await Promise.all(
          pokemonList.map((pokemon) => fetchPokemonDetails(pokemon.url))
        );
        return detailedPokemonData;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  export default usePokemons;