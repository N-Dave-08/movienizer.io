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
}
