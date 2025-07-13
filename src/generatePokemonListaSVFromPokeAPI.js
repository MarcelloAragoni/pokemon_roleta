import fs from "fs";

const POKEDEXES = [
  "paldea", // Pokédex de Paldea
  "kitakami", // Pokédex de Kitakami (Teal Mask DLC)
  "blueberry", // Pokédex de Blueberry (Indigo Disk DLC)
];

const API_BASE = "https://pokeapi.co/api/v2/pokedex/";

async function fetchPokedex(pokedex) {
  const res = await fetch(`${API_BASE}${pokedex}`);
  const data = await res.json();
  return data.pokemon_entries.map((entry) => ({
    dex_nacional: entry.pokemon_species.url.match(/\/(\d+)\/$/)[1],
    nome: entry.pokemon_species.name,
  }));
}

async function main() {
  const allEntries = [];
  for (const pokedex of POKEDEXES) {
    const entries = await fetchPokedex(pokedex);
    allEntries.push(...entries);
  }
  // Remover duplicatas pelo dex_nacional
  const unique = Array.from(
    new Map(allEntries.map((p) => [p.dex_nacional, p])).values()
  );
  // Ordenar pelo número da National Dex
  unique.sort((a, b) => Number(a.dex_nacional) - Number(b.dex_nacional));
  fs.writeFileSync("src/pokemonListaSV.json", JSON.stringify(unique, null, 2));
  console.log(
    `Arquivo src/pokemonListaSV.json gerado com ${unique.length} Pokémon!`
  );
}

main();
