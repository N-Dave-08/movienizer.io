export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_name: string;
  origin_country: string[];
}

// Extended TV Show details with seasons and episodes info
export interface TVShowDetails extends TVShow {
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: TVSeasonSummary[];
  status: string;
  type: string;
  in_production: boolean;
  last_air_date: string | null;
  next_episode_to_air: TVEpisodeDetails | null;
  created_by: Array<{
    id: number;
    name: string;
  }>;
  networks: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
}

export interface TVSeasonSummary {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episode_count: number;
}

export interface TVSeasonDetails extends TVSeasonSummary {
  episodes: TVEpisodeDetails[];
  _id: string;
}

export interface TVEpisodeDetails {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
  season_number: number;
  vote_average: number;
  vote_count: number;
  crew: Array<{
    id: number;
    name: string;
    job: string;
  }>;
  guest_stars: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
