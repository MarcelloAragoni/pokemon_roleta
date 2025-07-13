import axios from "axios";
import type { Pokemon } from "../types/pokemon";

const API_BASE_URL = "https://pokeapi.co/api/v2";
const MAX_POKEDEX_ID = 1025;

// Lista de IDs dos Pokémon presentes em Scarlet/Violet + DLCs (Paldea, Kitakami, Blueberry, retornantes)
// Fonte: Bulbapedia, Serebii, Pokédex oficial
export const SV_POKEMON_IDS: number[] = [
  // Paldea (906-1010)
  ...Array.from({ length: 1010 - 906 + 1 }, (_, i) => i + 906),
  // Kitakami (Teal Mask DLC, 1011-1025)
  ...Array.from({ length: 1025 - 1011 + 1 }, (_, i) => i + 1011),
  // Blueberry (Indigo Disk DLC, 1026-1045)
  ...Array.from({ length: 1045 - 1026 + 1 }, (_, i) => i + 1026),
  // Retornantes (exemplo: 1-905, mas só os que voltaram)
  // Adicione aqui os IDs dos retornantes reais, exemplo:
  1,
  2,
  3,
  6,
  7,
  9,
  25,
  94,
  131,
  143,
  149,
  150,
  151,
  181,
  196,
  197,
  212,
  214,
  229,
  248,
  282,
  303,
  306,
  319,
  334,
  350,
  376,
  380,
  381,
  384,
  392,
  398,
  445,
  448,
  460,
  461,
  462,
  475,
  479,
  483,
  484,
  487,
  488,
  491,
  492,
  493,
  530,
  549,
  553,
  555,
  560,
  571,
  609,
  635,
  637,
  638,
  639,
  640,
  641,
  642,
  645,
  646,
  647,
  648,
  649,
  658,
  663,
  678,
  681,
  700,
  701,
  702,
  703,
  704,
  705,
  706,
  707,
  708,
  709,
  710,
  711,
  712,
  713,
  714,
  715,
  716,
  717,
  718,
  719,
  720,
  721,
  724,
  727,
  730,
  740,
  741,
  743,
  745,
  746,
  748,
  749,
  750,
  751,
  752,
  753,
  754,
  755,
  756,
  757,
  758,
  759,
  760,
  761,
  762,
  763,
  764,
  765,
  766,
  767,
  768,
  769,
  770,
  771,
  772,
  773,
  774,
  775,
  776,
  777,
  778,
  779,
  780,
  781,
  782,
  783,
  784,
  785,
  786,
  787,
  788,
  789,
  790,
  791,
  792,
  793,
  794,
  795,
  796,
  797,
  798,
  799,
  800,
  801,
  802,
  803,
  804,
  805,
  806,
  807,
  808,
  809,
  810,
  811,
  812,
  813,
  814,
  815,
  816,
  817,
  818,
  819,
  820,
  821,
  822,
  823,
  824,
  825,
  826,
  827,
  828,
  829,
  830,
  831,
  832,
  833,
  834,
  835,
  836,
  837,
  838,
  839,
  840,
  841,
  842,
  843,
  844,
  845,
  846,
  847,
  848,
  849,
  850,
  851,
  852,
  853,
  854,
  855,
  856,
  857,
  858,
  859,
  860,
  861,
  862,
  863,
  864,
  865,
  866,
  867,
  868,
  869,
  870,
  871,
  872,
  873,
  874,
  875,
  876,
  877,
  878,
  879,
  880,
  881,
  882,
  883,
  884,
  885,
  886,
  887,
  888,
  889,
  890,
  891,
  892,
  893,
  894,
  895,
  896,
  897,
  898,
  899,
  900,
  901,
  902,
  903,
  904,
  905,
];

// Exclusivos de Scarlet (exemplo, IDs reais devem ser conferidos em fontes oficiais)
export const SCARLET_EXCLUSIVES: number[] = [
  940, 941, 942, 943, 944, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954,
  955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969,
  970, 971, 972, 973, 974, 975, 976, 977, 978, 979, 980, 981, 982, 983, 984,
  985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999,
  1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010,
  // ...adicione os IDs reais dos exclusivos Scarlet
];

// Exclusivos de Violet (exemplo, IDs reais devem ser conferidos em fontes oficiais)
export const VIOLET_EXCLUSIVES: number[] = [
  950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964,
  965, 966, 967, 968, 969, 970, 971, 972, 973, 974, 975, 976, 977, 978, 979,
  980, 981, 982, 983, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994,
  995, 996, 997, 998, 999, 1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008,
  1009, 1010,
  // ...adicione os IDs reais dos exclusivos Violet
];

// IDs dos lendários de Scarlet/Violet + DLCs (exemplo, IDs reais devem ser conferidos)
export const LEGENDARIES_SV: number[] = [
  888,
  889,
  890,
  891,
  892,
  893,
  894,
  895,
  896,
  897,
  898, // Zacian, Zamazenta, Eternatus, Kubfu, Urshifu, Zarude, Regieleki, Regidrago, Glastrier, Spectrier, Calyrex
  1007,
  1008, // Koraidon, Miraidon
  1009,
  1010, // Chien-Pao, Ting-Lu, Wo-Chien, Chi-Yu (exemplo)
  1016,
  1017,
  1018,
  1019, // Ogerpon, Terapagos, etc (exemplo)
  // ...adicione todos os IDs lendários de SV e DLCs
];

// IDs dos míticos de Scarlet/Violet + DLCs (exemplo, IDs reais devem ser conferidos)
export const MYTHICALS_SV: number[] = [
  151,
  251,
  385,
  386,
  489,
  490,
  491,
  492,
  493,
  494,
  647,
  648,
  649,
  719,
  720,
  721,
  801,
  802,
  807,
  808,
  809,
  893,
  894,
  895,
  896,
  897,
  898,
  9999, // 9999 = placeholder para garantir que não caia nenhum
  // ...adicione todos os IDs míticos de SV e DLCs
];

export class PokemonApiService {
  private static instance: PokemonApiService;
  private pokemonCache: Map<number, Pokemon> = new Map();

  private constructor() {}

  static getInstance(): PokemonApiService {
    if (!PokemonApiService.instance) {
      PokemonApiService.instance = new PokemonApiService();
    }
    return PokemonApiService.instance;
  }

  async getAllPokemonNames(): Promise<{ name: string; id: number }[]> {
    // Busca todos os nomes e ids dos pokémons da Pokédex nacional
    try {
      const response = await axios.get(`${API_BASE_URL}/pokemon?limit=1300`);
      return response.data.results.map((p: { name: string; url: string }) => {
        const id = Number(p.url.split("/").filter(Boolean).pop());
        return { name: p.name, id };
      });
    } catch (error) {
      return [];
    }
  }

  async getAllPokemonCount(): Promise<number> {
    // Busca o número total de Pokémon disponíveis na PokéAPI
    try {
      const response = await axios.get(
        `${API_BASE_URL}/pokemon-species/?limit=1`
      );
      return response.data.count;
    } catch (error) {
      return MAX_POKEDEX_ID;
    }
  }

  async getScarletVioletPokemonNames(): Promise<
    { name: string; id: number }[]
  > {
    // Busca apenas os nomes e ids dos pokémons presentes em Scarlet/Violet + DLCs
    try {
      const response = await axios.get(`${API_BASE_URL}/pokemon?limit=1300`);
      const all = response.data.results.map(
        (p: { name: string; url: string }) => {
          const id = Number(p.url.split("/").filter(Boolean).pop());
          return { name: p.name, id };
        }
      );
      return all.filter((p: { name: string; id: number }) =>
        SV_POKEMON_IDS.includes(p.id)
      );
    } catch (error) {
      return [];
    }
  }

  async getPokemonById(id: number): Promise<Pokemon | null> {
    if (this.pokemonCache.has(id)) {
      return this.pokemonCache.get(id)!;
    }
    try {
      const response = await axios.get<Pokemon>(
        `${API_BASE_URL}/pokemon/${id}`
      );
      const pokemon = response.data;
      this.pokemonCache.set(id, pokemon);
      return pokemon;
    } catch (error) {
      return null;
    }
  }

  async getRandomPokemon(): Promise<Pokemon | null> {
    const count = await this.getAllPokemonCount();
    let pokemon: Pokemon | null = null;
    while (!pokemon) {
      const randomId = Math.floor(Math.random() * count) + 1;
      pokemon = await this.getPokemonById(randomId);
    }
    return pokemon;
  }

  getTypeColor(typeName: string): string {
    const typeColors: { [key: string]: string } = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    };
    return typeColors[typeName] || "#777777";
  }

  formatPokemonName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).replace("-", " ");
  }
}
