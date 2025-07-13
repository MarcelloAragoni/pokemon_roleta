const fs = require("fs");
const path = require("path");
const readline = require("readline");

const listaPath = path.join(__dirname, "pokemonLista.json");
const csvPath = path.join(__dirname, "pokedex nacional.csv");
const outputPath = path.join(__dirname, "pokemonLista_sv_dex.json");

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function loadNationalDexCSV() {
  const dex = {};
  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (!line.trim() || line.startsWith("#")) continue;
    const [num, , name] = line.split(",");
    if (name) {
      dex[normalizeName(name)] = parseInt(num.replace("#", ""), 10);
    }
  }
  return dex;
}

async function gerarListaSV() {
  const lista = JSON.parse(fs.readFileSync(listaPath, "utf8"));
  const dex = await loadNationalDexCSV();
  const resultado = [];

  for (let poke of lista) {
    const key = normalizeName(poke.nome);
    if (dex[key]) {
      resultado.push({ ...poke, dex_nacional: dex[key] });
    } else {
      console.warn(`Não encontrado na National Dex: ${poke.nome}`);
    }
  }
  fs.writeFileSync(outputPath, JSON.stringify(resultado, null, 2));
  console.log(`Arquivo gerado: ${outputPath}`);
}

gerarListaSV();
