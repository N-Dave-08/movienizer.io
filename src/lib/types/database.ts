/**
 * Database Types
 *
 * TypeScript interfaces for Supabase database tables and operations.
 */

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
  // Episode tracking fields for TV shows
  total_episodes?: number;
  watched_episodes?: number;
  current_season?: number;
  current_episode?: number;
  last_watched_at?: string;
  // Simple list of watched episodes ["S1E1", "S1E2", "S2E1"]
  watched_episodes_list?: string[];
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

export interface UpdateWatchlistItem {
  watched?: boolean;
  user_rating?: number | null;
  notes?: string | null;
  total_episodes?: number;
  watched_episodes?: number;
  current_season?: number;
  current_episode?: number;
  last_watched_at?: string;
  watched_episodes_list?: string[];
}

export interface EpisodeProgress {
  totalEpisodes: number;
  watchedEpisodes: number;
  currentSeason: number;
  currentEpisode: number;
  progressPercentage: number;
  nextEpisode?: {
    season: number;
    episode: number;
    name: string;
  };
}

// Simplified episode interface - just what we need from TMDB
export interface SimpleEpisode {
  season_number: number;
  episode_number: number;
  name: string;
  overview?: string;
  still_path?: string;
  air_date?: string;
  runtime?: number;
  vote_average?: number;
  watched: boolean; // Derived from watched_episodes_list
}

export interface SimpleSeason {
  season_number: number;
  name: string;
  episode_count: number;
  episodes: SimpleEpisode[];
}
