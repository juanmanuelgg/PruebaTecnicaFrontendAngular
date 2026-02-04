export interface Pokemon {
  id: number;
  name: string;
  normalizedName: string;
  imageUrl: string;
  abilities: Ability[];
  types: Type[];
}

export interface Ability {
  name: string;
  url: string;
}

export interface Type {
  name: string;
  url: string;
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  abilities: {
    ability: {
      name: string;
      url: string;
    };
  }[];
  types: {
    type: {
      name: string;
      url: string;
    };
  }[];
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}
