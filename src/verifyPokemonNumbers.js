// Lista de Pokémon de Scarlet/Violet para verificar
const pokemonToVerify = [
  "sprigatito",
  "floragato",
  "meowscarada",
  "fuecoco",
  "crocalor",
  "skeledirge",
  "quaxly",
  "quaxwell",
  "quaquaval",
  "lechonk",
  "oinkologne",
  "tarountula",
  "spidops",
  "nymble",
  "lokix",
  "pawmi",
  "pawmo",
  "pawmot",
  "wiglett",
  "wugtrio",
  "dondozo",
  "veluza",
  "finizen",
  "palafin",
  "smoliv",
  "dolliv",
  "arboliva",
  "capsakid",
  "scovillain",
  "rellor",
  "rabsca",
  "flittle",
  "espathra",
  "tinkatink",
  "tinkatuff",
  "tinkaton",
  "bombirdier",
  "squawkabilly",
  "flamigo",
  "klawf",
  "nacli",
  "naclstack",
  "garganacl",
  "glimmet",
  "glimmora",
  "shroodle",
  "grafaiai",
  "fidough",
  "dachsbun",
  "maschiff",
  "mabosstiff",
  "bramblin",
  "brambleghast",
  "toedscool",
  "toedscruel",
];

async function verifyPokemonNumbers() {
  console.log("Verificando números da National Dex...\n");

  const results = [];

  for (const pokemonName of pokemonToVerify) {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const data = await response.json();

      results.push({
        name: data.name,
        id: data.id,
        official_name: data.species.name,
      });

      console.log(`${data.id.toString().padStart(3, "0")} - ${data.name}`);

      // Pequena pausa para não sobrecarregar a API
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Erro ao buscar ${pokemonName}:`, error.message);
    }
  }

  console.log("\n=== RESULTADOS ===");
  console.log(JSON.stringify(results, null, 2));
}

verifyPokemonNumbers();
