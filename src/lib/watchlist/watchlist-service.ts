"use client";

import { createClient } from "@/lib/supabase/client";
import type {
  CreateWatchlistItem,
  UpdateWatchlistItem,
  WatchlistItem,
} from "@/lib/types/database";

/**
 * Watchlist Service
 *
 * Provides functions for managing user's watchlist items in Supabase.
 * All functions handle authentication and provide proper error handling.
 */

export async function addToWatchlist(
  item: CreateWatchlistItem,
): Promise<WatchlistItem> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("watchlist_items")
    .insert({
      user_id: user.id, // Explicitly set the user_id
      tmdb_id: item.tmdb_id,
      media_type: item.media_type,
      title: item.title,
      poster_path: item.poster_path,
      overview: item.overview,
      release_date: item.release_date,
      vote_average: item.vote_average,
    })
    .select()
    .single();

  if (error) {
    // Handle duplicate entry error gracefully
    if (error.code === "23505") {
      throw new Error("This item is already in your watchlist");
    }
    throw new Error(`Failed to add to watchlist: ${error.message}`);
  }

  return data;
}

export async function removeFromWatchlist(
  tmdbId: number,
  mediaType: "movie" | "tv",
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("watchlist_items")
    .delete()
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType);

  if (error) {
    throw new Error(`Failed to remove from watchlist: ${error.message}`);
  }
}

export async function getWatchlist(): Promise<WatchlistItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("watchlist_items")
    .select("*")
    .order("added_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch watchlist: ${error.message}`);
  }

  return data || [];
}

export async function updateWatchlistItem(
  id: string,
  updates: UpdateWatchlistItem,
): Promise<WatchlistItem> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("watchlist_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update watchlist item: ${error.message}`);
  }

  return data;
}

export async function isInWatchlist(
  tmdbId: number,
  mediaType: "movie" | "tv",
): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("watchlist_items")
    .select("id")
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType)
    .limit(1);

  if (error) {
    return false;
  }

  return (data?.length || 0) > 0;
}

export async function getWatchlistCount(): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("watchlist_items")
    .select("*", { count: "exact", head: true });

  if (error) {
    return 0;
  }

  return count || 0;
}
