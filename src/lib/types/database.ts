/**
 * Database Types
 *
 * TypeScript interfaces for Supabase database tables and operations.
 */

// New user_episodes table interface
export interface UserEpisode {
  id: string;
  user_id: string;
  tmdb_id: number;
  season_number: number;
  episode_number: number;
  watched: boolean;
  watched_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserEpisode {
  tmdb_id: number;
  season_number: number;
  episode_number: number;
  watched: boolean;
  watched_at?: string | null;
}

export interface UpdateUserEpisode {
  watched?: boolean;
  watched_at?: string | null;
  updated_at?: string;
}

// Updated WatchlistItem interface - removed old episode tracking fields
export interface WatchlistItem {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  overview: string | null;
  release_date: string | null;
  vote_average: number | null;
  added_at: string;
  watched: boolean;
  user_rating: number | null;
  notes: string | null;
  total_episodes?: number; // Keep this for reference
  last_watched_at?: string;
}

export interface CreateWatchlistItem {
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  overview: string | null;
  release_date: string | null;
  vote_average: number | null;
}

// Updated UpdateWatchlistItem interface - removed old episode fields
export interface UpdateWatchlistItem {
  watched?: boolean;
  user_rating?: number | null;
  notes?: string | null;
  total_episodes?: number;
  last_watched_at?: string;
}

// Updated EpisodeProgress interface
export interface EpisodeProgress {
  totalEpisodes: number;
  watchedEpisodes: number;
  currentSeason: number;
  currentEpisode: number;
  nextUnwatchedEpisode: {
    season: number;
    episode: number;
    name: string;
  } | null;
}

// Updated SimpleEpisode interface - watched status comes from user_episodes table
export interface SimpleEpisode {
  season_number: number;
  episode_number: number;
  name: string;
  overview?: string;
  still_path?: string;
  air_date?: string;
  runtime?: number;
  vote_average?: number;
  watched: boolean; // Now derived from user_episodes table
}

export interface SimpleSeason {
  season_number: number;
  name: string;
  episode_count: number;
  episodes: SimpleEpisode[];
}
