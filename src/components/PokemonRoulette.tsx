import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import type { Pokemon } from "../types/pokemon";
import {
  PokemonApiService,
  SCARLET_EXCLUSIVES,
  VIOLET_EXCLUSIVES,
  LEGENDARIES_SV,
  MYTHICALS_SV,
} from "../services/pokemonApi";
import "./PokemonRoulette.css";

const apiService = PokemonApiService.getInstance();

type Version = "all" | "scarlet" | "violet";
const WHEEL_SIZE = 30;

function getRandomSample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

const PokemonRoulette: React.FC = () => {
  const [allNames, setAllNames] = useState<{ name: string; id: number }[]>([]);
  const [filteredNames, setFilteredNames] = useState<
    { name: string; id: number }[]
  >([]);
  const [wheelNames, setWheelNames] = useState<{ name: string; id: number }[]>(
    []
  );
  const [rotatedWheel, setRotatedWheel] = useState<
    { name: string; id: number }[]
  >([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState<Version>("all");

  useEffect(() => {
    const fetchNames = async () => {
      setIsLoading(true);
      const names = await apiService.getScarletVioletPokemonNames();
      setAllNames(names);
      setIsLoading(false);
    };
    fetchNames();
  }, []);

  useEffect(() => {
    let filtered: { name: string; id: number }[] = [];
    if (version === "all") {
      filtered = allNames;
    } else if (version === "scarlet") {
      filtered = allNames.filter((p) => SCARLET_EXCLUSIVES.includes(p.id));
    } else if (version === "violet") {
      filtered = allNames.filter((p) => VIOLET_EXCLUSIVES.includes(p.id));
    }
    // Excluir lendários e míticos
    filtered = filtered.filter(
      (p) => !LEGENDARIES_SV.includes(p.id) && !MYTHICALS_SV.includes(p.id)
    );
    setFilteredNames(filtered);
    const sample = getRandomSample(filtered, WHEEL_SIZE);
    setWheelNames(sample);
    setRotatedWheel(sample); // Inicialmente sem rotação
    setSelected(null);
  }, [version, allNames]);

  const handleSpinClick = () => {
    if (mustSpin || isLoading || wheelNames.length === 0) return;
    const N = wheelNames.length;
    const random = Math.floor(Math.random() * N);
    const offset = Math.floor(N / 4); // 90°
    // prizeNumber = (random - offset + N) % N
    setPrizeNumber((random - offset + N) % N);
    setSelected(null);
    setMustSpin(true);
  };

  const handleStopSpinning = async () => {
    setMustSpin(false);
    setIsLoading(true);
    // O Pokémon sorteado é o que está sob o ponteiro à direita
    const N = wheelNames.length;
    const offset = Math.floor(N / 4);
    const sortedIndex = (prizeNumber + offset) % N;
    const poke = await apiService.getPokemonById(wheelNames[sortedIndex].id);
    setSelected(poke);
    setIsLoading(false);
  };

  const handleNewWheel = () => {
    const sample = getRandomSample(filteredNames, WHEEL_SIZE);
    setWheelNames(sample);
    setRotatedWheel(sample);
    setSelected(null);
  };

  return (
    <div className="pokemon-roulette">
      <div className="roulette-header">
        <h1>🎰 Roleta de Pokémon</h1>
        <p className="subtitle">
          Escolha a versão para sortear entre os exclusivos! (Lendários e
          míticos excluídos)
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            margin: "20px 0",
          }}
        >
          <button
            className={`spin-button${version === "all" ? " selected" : ""}`}
            onClick={() => setVersion("all")}
            disabled={isLoading}
          >
            Todos
          </button>
          <button
            className={`spin-button${version === "scarlet" ? " selected" : ""}`}
            onClick={() => setVersion("scarlet")}
            disabled={isLoading}
          >
            Scarlet
          </button>
          <button
            className={`spin-button${version === "violet" ? " selected" : ""}`}
            onClick={() => setVersion("violet")}
            disabled={isLoading}
          >
            Violet
          </button>
        </div>
      </div>
      <div className="roulette-flex">
        <div
          className="roulette-container"
          style={{ flex: 1, alignItems: "flex-end" }}
        >
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando Pokédex Scarlet/Violet...</p>
            </div>
          ) : rotatedWheel.length === 0 ? (
            <div className="loading-container">
              <p>Nenhum Pokémon disponível para esta versão.</p>
            </div>
          ) : (
            <>
              <div style={{ position: "relative", width: 520, height: 520 }}>
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={rotatedWheel.map((p) => ({
                    option: apiService.formatPokemonName(p.name),
                    style: { fontSize: 12, color: "white", fontWeight: "bold" },
                  }))}
                  backgroundColors={[
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
                  ]}
                  textColors={["white"]}
                  fontSize={12}
                  spinDuration={1.5}
                  onStopSpinning={handleStopSpinning}
                  outerBorderColor="#fff"
                  innerBorderColor="#fff"
                  radiusLineColor="#fff"
                  pointerProps={{
                    style: {
                      width: 0,
                      height: 0,
                      borderTop: "30px solid transparent",
                      borderBottom: "30px solid transparent",
                      borderLeft: "40px solid #fff",
                      position: "absolute",
                      right: -40,
                      top: "calc(50% - 30px)",
                      zIndex: 2,
                    },
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <button
                  className="spin-button"
                  onClick={handleSpinClick}
                  disabled={mustSpin || isLoading || rotatedWheel.length === 0}
                >
                  {mustSpin ? "Girando..." : "Girar Roleta"}
                </button>
                <button
                  className="spin-button"
                  onClick={handleNewWheel}
                  disabled={
                    mustSpin || isLoading || filteredNames.length < WHEEL_SIZE
                  }
                >
                  Nova Roleta
                </button>
              </div>
            </>
          )}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {selected && !isLoading && (
            <div className="pokemon-card">
              <div className="pokemon-header">
                <h2 className="pokemon-name">
                  {apiService.formatPokemonName(selected.name)}
                  <span className="shiny-badge">✨</span>
                </h2>
                <span className="pokemon-id">
                  #{selected.id.toString().padStart(4, "0")}
                </span>
              </div>
              <div className="pokemon-image-container">
                <img
                  src={
                    selected.sprites.other["official-artwork"].front_shiny ||
                    selected.sprites.front_shiny ||
                    selected.sprites.front_default
                  }
                  alt={selected.name}
                  className="pokemon-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = selected.sprites.front_default;
                  }}
                />
              </div>
              <div className="pokemon-types">
                {selected.types.map((type, index) => (
                  <span
                    key={index}
                    className="type-badge"
                    style={{
                      backgroundColor: apiService.getTypeColor(type.type.name),
                    }}
                  >
                    {type.type.name.toUpperCase()}
                  </span>
                ))}
              </div>
              <div className="pokemon-info">
                <div className="info-row">
                  <span className="info-label">Altura:</span>
                  <span className="info-value">{selected.height / 10}m</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Peso:</span>
                  <span className="info-value">{selected.weight / 10}kg</span>
                </div>
              </div>
              <div className="pokemon-stats">
                <h3>Estatísticas</h3>
                <div className="stats-grid">
                  {selected.stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                      <span className="stat-name">{stat.stat.name}</span>
                      <div className="stat-bar">
                        <div
                          className="stat-fill"
                          style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                        ></div>
                      </div>
                      <span className="stat-value">{stat.base_stat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pokemon-abilities">
                <h3>Habilidades</h3>
                <div className="abilities-list">
                  {selected.abilities.map((ability, index) => (
                    <span
                      key={index}
                      className={`ability ${ability.is_hidden ? "hidden" : ""}`}
                    >
                      {apiService.formatPokemonName(ability.ability.name)}
                      {ability.is_hidden && (
                        <span className="hidden-badge">(Oculta)</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="roulette-footer">
        <p>
          Roleta com 30 Pokémon aleatórios da lista filtrada! Gire ou atualize
          para ver outros! (Lendários e míticos excluídos)
        </p>
        <p className="shiny-info">Sempre mostra o retrato shiny do sorteado!</p>
      </div>
    </div>
  );
};

export default PokemonRoulette;
