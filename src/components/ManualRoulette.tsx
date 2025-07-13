import React, { useState, useEffect } from "react";
import type { Pokemon } from "../types/pokemon";
import {
  PokemonApiService,
  SV_POKEMON_IDS,
  SCARLET_EXCLUSIVES,
  VIOLET_EXCLUSIVES,
  LEGENDARIES_SV,
  MYTHICALS_SV,
} from "../services/pokemonApi";
import "./PokemonRoulette.css";
import pokemonLista from "../pokemonLista.json";

console.log("SV_POKEMON_IDS", SV_POKEMON_IDS.length);

const apiService = PokemonApiService.getInstance();
const WHEEL_SIZE = 30;
const RADIUS = 350;
const CENTER = 400;
const COLORS = [
  "#e74c3c",
  "#f1c40f",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#e67e22",
  "#1abc9c",
  "#34495e",
  "#f39c12",
  "#7f8c8d",
  "#ff7675",
  "#fdcb6e",
  "#00b894",
  "#00cec9",
  "#6c5ce7",
  "#fd79a8",
  "#636e72",
  "#d35400",
  "#00b894",
  "#0984e3",
  "#b2bec3",
  "#fab1a0",
  "#81ecec",
  "#a29bfe",
  "#ffeaa7",
  "#fd79a8",
  "#636e72",
  "#d35400",
  "#00b894",
  "#0984e3",
];

type Version = "all" | "scarlet" | "violet";

function getRandomSample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function getSectorPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const rad = (deg: number) => (Math.PI / 180) * deg;
  const x1 = cx + r * Math.cos(rad(startAngle));
  const y1 = cy + r * Math.sin(rad(startAngle));
  const x2 = cx + r * Math.cos(rad(endAngle));
  const y2 = cy + r * Math.sin(rad(endAngle));
  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`;
}

// Função utilitária para ícone de tipo
const TYPE_ICONS: Record<string, string> = {
  normal: "⬜️",
  fire: "🔥",
  water: "💧",
  electric: "⚡",
  grass: "🌿",
  ice: "❄️",
  fighting: "🥊",
  poison: "☠️",
  ground: "🌎",
  flying: "🕊️",
  psychic: "🔮",
  bug: "🐞",
  rock: "🪨",
  ghost: "👻",
  dragon: "🐉",
  dark: "🌑",
  steel: "⚙️",
  fairy: "🧚",
};

const ManualRoulette: React.FC = () => {
  const [allNames, setAllNames] = useState<{ name: string; id: number }[]>([]);
  const [filteredNames, setFilteredNames] = useState<
    { name: string; id: number }[]
  >([]);
  const [wheelNames, setWheelNames] = useState<{ name: string; id: number }[]>(
    []
  );
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [version] = useState<Version>("scarlet");
  const [angle, setAngle] = useState(0); // rotação da roleta
  const [spinning, setSpinning] = useState(false);
  const [speciesInfo, setSpeciesInfo] = useState<{
    genus_en?: string;
    genus_pt?: string;
    flavor_en?: string;
    flavor_pt?: string;
  }>({});

  useEffect(() => {
    // Montar a lista a partir do JSON
    const nomes = pokemonLista.map((p: any) => ({
      name: p.nome.toLowerCase().replace(" ", "-"),
      id: p.dex_nacional,
    }));
    setAllNames(nomes);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered: { name: string; id: number }[] = [];
    if (version === "scarlet") {
      filtered = allNames.filter((p) => SCARLET_EXCLUSIVES.includes(p.id));
    } else if (version === "violet") {
      filtered = allNames.filter((p) => VIOLET_EXCLUSIVES.includes(p.id));
    }
    filtered = filtered.filter(
      (p) => !LEGENDARIES_SV.includes(p.id) && !MYTHICALS_SV.includes(p.id)
    );
    setFilteredNames(filtered);
    setWheelNames(getRandomSample(filtered, WHEEL_SIZE));
    setSelected(null);
    setAngle(0);
  }, [version, allNames]);

  const handleSpin = async () => {
    if (spinning || isLoading || wheelNames.length === 0) return;
    setSpinning(true);
    setSelected(null);
    setSpeciesInfo({});
    const N = wheelNames.length;
    const random = Math.floor(Math.random() * N);
    const sectorAngle = 360 / N;
    const centerOfSector = sectorAngle * random + sectorAngle / 2;
    const voltas = 5;
    const finalAngle = voltas * 360 - centerOfSector; // Ponteiro à direita (0°)
    setAngle(finalAngle);
    setTimeout(async () => {
      setSpinning(false);
      setIsLoading(true);
      const poke = await apiService.getPokemonById(wheelNames[random].id);
      setSelected(poke);
      // Buscar species
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${poke?.id}/`
        );
        const data = await res.json();
        const genus_en =
          data.genera.find((g: any) => g.language.name === "en")?.genus || "";
        const genus_pt =
          data.genera.find((g: any) => g.language.name === "pt")?.genus || "";
        const flavor_en =
          data.flavor_text_entries
            .find((f: any) => f.language.name === "en")
            ?.flavor_text.replace(/\f/g, " ") || "";
        const flavor_pt =
          data.flavor_text_entries
            .find((f: any) => f.language.name === "pt")
            ?.flavor_text.replace(/\f/g, " ") || "";
        setSpeciesInfo({ genus_en, genus_pt, flavor_en, flavor_pt });
      } catch (e) {
        setSpeciesInfo({});
      }
      setIsLoading(false);
    }, 2500);
  };

  const handleNewWheel = () => {
    const maxPokemons = Math.min(filteredNames.length, WHEEL_SIZE);
    let newWheel;
    do {
      newWheel = getRandomSample(filteredNames, maxPokemons);
    } while (
      newWheel.length === wheelNames.length &&
      newWheel.every((p, i) => p.id === wheelNames[i]?.id)
    );
    setWheelNames(newWheel);
    setSelected(null);
    setAngle(0);
  };

  return (
    <div
      className="roulette-flex"
      style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
    >
      <div
        className="roulette-container"
        style={{ width: "100%", alignItems: "center", minWidth: 0 }}
      >
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando Pokédex Scarlet/Violet...</p>
          </div>
        ) : wheelNames.length === 0 ? (
          <div className="loading-container">
            <p>Nenhum Pokémon disponível para esta versão.</p>
          </div>
        ) : (
          <>
            <div
              className="roulette-svg-wrapper"
              style={{
                position: "relative",
                width: 800,
                height: 800,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "visible",
              }}
            >
              <svg
                width={CENTER * 2}
                height={CENTER * 2}
                style={{
                  transform: `rotate(${angle}deg)`,
                  transition: spinning
                    ? "transform 2.5s cubic-bezier(.17,.67,.83,.67)"
                    : "none",
                  zIndex: 1,
                }}
              >
                {wheelNames.map((p, i) => {
                  const N = wheelNames.length;
                  const startAngle = (360 / N) * i;
                  const endAngle = (360 / N) * (i + 1);
                  return (
                    <g key={p.id}>
                      <path
                        d={getSectorPath(
                          CENTER,
                          CENTER,
                          RADIUS,
                          startAngle,
                          endAngle
                        )}
                        fill={COLORS[i % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                      <text
                        x={
                          CENTER +
                          (RADIUS - 60) *
                            Math.cos(
                              (((startAngle + endAngle) / 2) * Math.PI) / 180
                            )
                        }
                        y={
                          CENTER +
                          (RADIUS - 60) *
                            Math.sin(
                              (((startAngle + endAngle) / 2) * Math.PI) / 180
                            )
                        }
                        fill="#fff"
                        fontSize={20}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline={
                          (startAngle + endAngle) / 2 > 90 &&
                          (startAngle + endAngle) / 2 < 270
                            ? "hanging"
                            : "middle"
                        }
                        style={{
                          userSelect: "none",
                          pointerEvents: "none",
                          filter: "drop-shadow(0 1px 2px #0008)",
                          paintOrder: "stroke fill",
                          stroke: "#222a",
                          strokeWidth: 2,
                        }}
                        transform={`rotate(${
                          (startAngle + endAngle) / 2 > 90 &&
                          (startAngle + endAngle) / 2 < 270
                            ? (startAngle + endAngle) / 2 + 180
                            : (startAngle + endAngle) / 2
                        },${
                          CENTER +
                          (RADIUS - 60) *
                            Math.cos(
                              (((startAngle + endAngle) / 2) * Math.PI) / 180
                            )
                        },${
                          CENTER +
                          (RADIUS - 60) *
                            Math.sin(
                              (((startAngle + endAngle) / 2) * Math.PI) / 180
                            )
                        })`}
                      >
                        {apiService.formatPokemonName(p.name)}
                      </text>
                    </g>
                  );
                })}
              </svg>
              {/* Ponteiro à direita, centralizado verticalmente */}
              <svg
                width={80}
                height={180}
                viewBox="0 0 80 180"
                className="roulette-pointer"
                style={{
                  position: "absolute",
                  right: "-20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  filter: "drop-shadow(0 2px 8px #0006)",
                }}
              >
                <polygon
                  points="0,90 80,60 80,120"
                  fill="#fff"
                  stroke="#888"
                  strokeWidth={4}
                />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 400,
                margin: "0 auto",
                justifyContent: "space-between",
              }}
            >
              <button
                className="spin-button"
                onClick={handleSpin}
                disabled={spinning || isLoading || wheelNames.length === 0}
              >
                {spinning ? "Girando..." : "Girar Roleta"}
              </button>
              <button
                className="spin-button"
                onClick={handleNewWheel}
                disabled={spinning || isLoading}
              >
                Nova Roleta
              </button>
            </div>
          </>
        )}
      </div>
      {/* Card do Pokémon sorteado abaixo da roleta */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "0px",
          minHeight: 420,
        }}
      >
        {selected && !isLoading && (
          <div className="pokehome-card">
            {/* Barra superior */}
            <div className="pokehome-header">
              <span className="pokehome-id">
                No.{selected.id.toString().padStart(3, "0")}
              </span>
              <span className="pokehome-name">
                {apiService.formatPokemonName(selected.name)}
              </span>
              <span className="pokehome-gender-icons">
                {/* Gênero: se disponível, mostrar ♂️ ♀️ */}
                {/* Shiny */}
                {selected.sprites.other["official-artwork"].front_shiny ? (
                  <span className="pokehome-shiny">✨</span>
                ) : null}
              </span>
            </div>
            {/* Imagem e navegação de sprites */}
            <div className="pokehome-imgbox">
              <img
                src={
                  selected.sprites.other["official-artwork"].front_shiny ||
                  selected.sprites.front_shiny ||
                  selected.sprites.front_default
                }
                alt={selected.name}
                className="pokehome-img"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = selected.sprites.front_default;
                }}
              />
              {/* Navegação de sprites (placeholder, pode ser expandido) */}
              {/* <div className="pokehome-sprite-nav"><span>1/1</span></div> */}
            </div>
            {/* Tipo */}
            <div className="pokehome-types-row">
              {selected.types.map((type, idx) => (
                <span
                  key={idx}
                  className="pokehome-type-badge"
                  style={{
                    background: apiService.getTypeColor(type.type.name),
                  }}
                >
                  <span className="pokehome-type-ico">
                    {TYPE_ICONS[type.type.name] || "❔"}
                  </span>
                  {type.type.name.charAt(0).toUpperCase() +
                    type.type.name.slice(1)}
                </span>
              ))}
            </div>
            {/* Genus */}
            <div className="pokehome-genus-bar">
              {speciesInfo.genus_en || "Pokémon"}
              {speciesInfo.genus_pt ? (
                <span className="pokehome-genus-pt">
                  {" "}
                  / {speciesInfo.genus_pt}
                </span>
              ) : null}
            </div>
            {/* Flavor text */}
            <div className="pokehome-flavor-box">
              <div className="pokehome-flavor-lang">ENG</div>
              <div className="pokehome-flavor-text">
                {speciesInfo.flavor_en}
              </div>
              <div className="pokehome-flavor-lang">PT</div>
              <div className="pokehome-flavor-text">
                {speciesInfo.flavor_pt}
              </div>
            </div>
            {/* Peso e altura */}
            <div className="pokehome-measure-row">
              <div className="pokehome-measure-card">
                <span role="img" aria-label="height">
                  📏
                </span>{" "}
                {(selected.height / 10).toFixed(1)}m
              </div>
              <div className="pokehome-measure-card">
                <span role="img" aria-label="weight">
                  ⚖️
                </span>{" "}
                {(selected.weight / 10).toFixed(1)}kg
              </div>
            </div>
            {/* Abilities */}
            <div className="pokehome-abilities">
              <div className="pokehome-abilities-title">Abilities</div>
              <div className="pokehome-abilities-list">
                {selected.abilities.map((a, i) => (
                  <div
                    key={i}
                    className={`pokehome-ability${
                      a.is_hidden ? " hidden" : ""
                    }`}
                  >
                    {apiService.formatPokemonName(a.ability.name)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualRoulette;
