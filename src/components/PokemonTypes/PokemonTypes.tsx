import React from 'react'


const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    psychic: '#F95587',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
    bug: '#A6B91A',
    flying: '#A98FF3',
  };

  export const PokemonTypes = ({ types }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {types.map((typeObj) => (
        <span
          key={typeObj.type.name}
          style={{
            backgroundColor: typeColors[typeObj.type.name] || '#000', 
            color: '#FFF', 
            textAlign: 'center',
            padding: '2px',
            borderRadius: '4px', 
          }}
        >
          {typeObj.type.name.toUpperCase()}
        </span>
      ))}
    </div>
  );
