"use client";

import {
  clearEpisodesForShow,
  markShowFullyWatched,
} from "@/lib/services/episode-service";
import { createClient } from "@/lib/supabase/client";
import { getTVShowWithSeasons } from "@/lib/tmbd/api";
import type {
  CreateWatchlistItem,
  UpdateWatchlistItem,
  WatchlistItem,
} from "@/lib/types/database";

/**
 * Watchlist Service
 *
 * Provides functions for managing user's watchlist items in Supabase.
 * Now uses the new episode tracking system with user_episodes table.
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
      user_id: user.id,
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

  // If it's a TV show, get the total episode count from TMDB
  if (item.media_type === "tv") {
    try {
      const tvDetails = await getTVShowWithSeasons(item.tmdb_id);
      const totalEpisodes = tvDetails.number_of_episodes || 0;

      // Update with episode count
      await supabase
        .from("watchlist_items")
        .update({ total_episodes: totalEpisodes })
        .eq("id", data.id);

      data.total_episodes = totalEpisodes;
    } catch (episodeError) {
      console.error("Failed to get episode count:", episodeError);
      // Don't fail the watchlist addition if episode count fails
    }
  }

  return data;
}

export async function removeFromWatchlist(
  tmdbId: number,
  mediaType: "movie" | "tv",
  clearEpisodes = false,
): Promise<void> {
  const supabase = createClient();

  // Clear episode data if requested (for TV shows)
  if (clearEpisodes && mediaType === "tv") {
    try {
      await clearEpisodesForShow(tmdbId);
    } catch (error) {
      console.error("Failed to clear episodes:", error);
      // Continue with watchlist removal even if episode cleanup fails
    }
  }

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("watchlist_items")
    .select("*")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load watchlist: ${error.message}`);
  }

  return data || [];
}

export async function getWatchlistItem(
  tmdbId: number,
  mediaType: "movie" | "tv",
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
    .select("*")
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType)
    .single();

  if (error) {
    throw new Error(`Failed to load watchlist item: ${error.message}`);
  }

  return data;
}

export async function updateWatchlistItem(
  id: string,
  updates: UpdateWatchlistItem,
): Promise<WatchlistItem> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get the current item to check if it's a TV show and if watched status is changing
  const { data: currentItem } = await supabase
    .from("watchlist_items")
    .select("*")
    .eq("id", id)
    .single();

  if (!currentItem) {
    throw new Error("Watchlist item not found");
  }

  // Handle TV show watched status changes
  if (currentItem.media_type === "tv" && updates.watched !== undefined) {
    try {
      if (updates.watched) {
        // Mark all episodes as watched using the new episode service
        const totalEpisodes = currentItem.total_episodes || 0;
        if (totalEpisodes > 0) {
          const _result = await markShowFullyWatched(
            currentItem.tmdb_id,
            totalEpisodes,
          );
          // The database function already handles updating the watchlist item
        }
      } else {
        // Clear all episodes when marking as unwatched
        await clearEpisodesForShow(currentItem.tmdb_id);
      }
    } catch (episodeError) {
      console.error("Failed to update TV show episodes:", episodeError);
      // Continue with regular update if episode update fails
    }
  }

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

// New function to handle adding a TV show as fully watched (from discover page)
export async function addTVShowAsWatched(
  item: CreateWatchlistItem,
): Promise<WatchlistItem> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // First add to watchlist
  const watchlistItem = await addToWatchlist(item);

  // Then mark as fully watched if it's a TV show
  if (item.media_type === "tv") {
    try {
      const totalEpisodes = watchlistItem.total_episodes || 0;
      if (totalEpisodes > 0) {
        const _result = await markShowFullyWatched(item.tmdb_id, totalEpisodes);
        // The database function already handles updating the watchlist item
      }

      // Update the watchlist item to mark as watched
      const { data: updatedItem } = await supabase
        .from("watchlist_items")
        .update({
          watched: true,
          last_watched_at: new Date().toISOString(),
        })
        .eq("id", watchlistItem.id)
        .select()
        .single();

      return updatedItem || watchlistItem;
    } catch (error) {
      console.error("Failed to mark TV show as fully watched:", error);
      // Return the watchlist item even if episode marking fails
      return watchlistItem;
    }
  }

  return watchlistItem;
}
