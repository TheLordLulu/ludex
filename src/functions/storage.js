export function SavePokemon(pokemon) {
    localStorage.setItem('pokedex_pokemons', JSON.stringify(pokemon))
}

export function GetPokemon() {
    return JSON.parse(localStorage.getItem('pokedex_pokemons'))
}