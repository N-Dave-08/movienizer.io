"use client";

import { createClient } from "@/lib/supabase/client";
import { getTVSeason, getTVShowWithSeasons } from "@/lib/tmbd/api";
import type { TVSeasonDetails, TVShowDetails } from "@/lib/tmbd/types";
import type {
  EpisodeProgress,
  SimpleEpisode,
  SimpleSeason,
  UserEpisode,
} from "@/lib/types/database";

/**
 * Episode Service
 *
 * New episode tracking system using the user_episodes table.
 * Much more robust than the previous JSON approach.
 */

/**
 * Toggle an episode's watched status
 */
export async function toggleEpisodeWatched(
  tmdbId: number,
  seasonNumber: number,
  episodeNumber: number,
  watched: boolean,
): Promise<{ watchlistUpdated: boolean }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get the current watchlist item to check if it will be fully watched
  const { data: beforeItem } = await supabase
    .from("watchlist_items")
    .select("watched, total_episodes")
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", "tv")
    .single();

  // Use the database function which automatically updates watchlist status
  const { error } = await supabase.rpc("toggle_episode_watched", {
    p_user_id: user.id,
    p_tmdb_id: tmdbId,
    p_season: seasonNumber,
    p_episode: episodeNumber,
    p_watched: watched,
  });

  if (error) {
    throw new Error(`Failed to update episode: ${error.message}`);
  }

  // Check if watchlist status changed
  const { data: afterItem } = await supabase
    .from("watchlist_items")
    .select("watched")
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", "tv")
    .single();

  return {
    watchlistUpdated: beforeItem?.watched !== afterItem?.watched,
  };
}

/**
 * Mark all episodes in a season as watched/unwatched
 */
export async function toggleSeasonWatched(
  tmdbId: number,
  seasonNumber: number,
  episodeCount: number,
  watched: boolean,
): Promise<{ watchlistUpdated: boolean }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get the current watchlist item to check if it will be fully watched
  const { data: beforeItem } = await supabase
    .from("watchlist_items")
    .select("watched, total_episodes")
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", "tv")
    .single();

  // Use the database function which automatically updates watchlist status
  const { error } = await supabase.rpc("toggle_season_watched", {
    p_user_id: user.id,
    p_tmdb_id: tmdbId,
    p_season: seasonNumber,
    p_episode_count: episodeCount,
    p_watched: watched,
  });

  if (error) {
    throw new Error(`Failed to update season: ${error.message}`);
  }

  // Check if watchlist status changed
  const { data: afterItem } = await supabase
    .from("watchlist_items")
    .select("watched")
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", "tv")
    .single();

  return {
    watchlistUpdated: beforeItem?.watched !== afterItem?.watched,
  };
}

/**
 * Mark all episodes of a TV show as watched
 */
export async function markShowFullyWatched(
  tmdbId: number,
  totalEpisodes: number,
): Promise<{ watchlistUpdated: boolean }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get the current watchlist item to check if it will be fully watched
  const { data: beforeItem } = await supabase
    .from("watchlist_items")
    .select("watched")
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", "tv")
    .single();

  // Use the database function which automatically updates watchlist status
  const { error } = await supabase.rpc("mark_show_fully_watched", {
    p_user_id: user.id,
    p_tmdb_id: tmdbId,
    p_total_episodes: totalEpisodes,
  });

  if (error) {
    throw new Error(`Failed to mark show as watched: ${error.message}`);
  }

  // Check if watchlist status changed
  const { data: afterItem } = await supabase
    .from("watchlist_items")
    .select("watched")
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", "tv")
    .single();

  return {
    watchlistUpdated: beforeItem?.watched !== afterItem?.watched,
  };
}

/**
 * Get all watched episodes for a TV show
 */
export async function getWatchedEpisodesForShow(
  tmdbId: number,
): Promise<UserEpisode[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("user_episodes")
    .select("*")
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId)
    .eq("watched", true)
    .order("season_number, episode_number");

  if (error) {
    throw new Error(`Failed to get watched episodes: ${error.message}`);
  }

  return data || [];
}

/**
 * Get episodes for a specific season with watched status
 */
export async function getEpisodesForSeason(
  tmdbId: number,
  seasonNumber: number,
): Promise<SimpleEpisode[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get episode data from TMDB
  const seasonDetails: TVSeasonDetails = await getTVSeason(
    tmdbId,
    seasonNumber,
  );

  // Get watched episodes from our database
  const { data: watchedEpisodes } = await supabase
    .from("user_episodes")
    .select("season_number, episode_number, watched")
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId)
    .eq("season_number", seasonNumber)
    .eq("watched", true);

  const watchedSet = new Set(
    watchedEpisodes?.map((ep) => `S${ep.season_number}E${ep.episode_number}`) ||
      [],
  );

  // Convert to simple format with watched status
  return seasonDetails.episodes.map((episode) => ({
    season_number: episode.season_number,
    episode_number: episode.episode_number,
    name: episode.name,
    overview: episode.overview,
    still_path: episode.still_path || undefined,
    air_date: episode.air_date,
    runtime: episode.runtime || undefined,
    vote_average: episode.vote_average,
    watched: watchedSet.has(
      `S${episode.season_number}E${episode.episode_number}`,
    ),
  }));
}

/**
 * Get all seasons for a show with watched status
 */
export async function getSeasonsForShow(
  tmdbId: number,
): Promise<SimpleSeason[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get show details from TMDB
  const tvDetails: TVShowDetails = await getTVShowWithSeasons(tmdbId);

  // Get all watched episodes for this show
  const { data: watchedEpisodes } = await supabase
    .from("user_episodes")
    .select("season_number, episode_number, watched")
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId)
    .eq("watched", true);

  const _watchedSet = new Set(
    watchedEpisodes?.map((ep) => `S${ep.season_number}E${ep.episode_number}`) ||
      [],
  );

  // Convert to simple format
  const seasons = await Promise.all(
    tvDetails.seasons
      .filter((season) => season.season_number > 0) // Skip specials
      .map(async (season) => {
        const episodes = await getEpisodesForSeason(
          tmdbId,
          season.season_number,
        );
        return {
          season_number: season.season_number,
          name: season.name,
          episode_count: season.episode_count,
          episodes,
        };
      }),
  );

  return seasons;
}

/**
 * Get watch progress for a TV show
 */
export async function getWatchlistProgress(
  tmdbId: number,
): Promise<EpisodeProgress | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    // Get TV show details
    const tvDetails = await getTVShowWithSeasons(tmdbId);
    const totalEpisodes = tvDetails.number_of_episodes || 0;

    if (totalEpisodes === 0) return null;

    // Get watched episodes count
    const { count: watchedCount } = await supabase
      .from("user_episodes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("tmdb_id", tmdbId)
      .eq("watched", true);

    const watchedEpisodes = watchedCount || 0;

    // Find next unwatched episode
    let nextUnwatchedEpisode = null;

    for (const season of tvDetails.seasons) {
      if (season.season_number === 0) continue; // Skip specials

      const seasonDetails = await getTVSeason(tmdbId, season.season_number);

      for (const episode of seasonDetails.episodes) {
        const { data: watchedEpisode } = await supabase
          .from("user_episodes")
          .select("watched")
          .eq("user_id", user.id)
          .eq("tmdb_id", tmdbId)
          .eq("season_number", episode.season_number)
          .eq("episode_number", episode.episode_number)
          .maybeSingle();

        if (!watchedEpisode || !watchedEpisode.watched) {
          nextUnwatchedEpisode = {
            season: episode.season_number,
            episode: episode.episode_number,
            name: episode.name,
          };
          break;
        }
      }

      if (nextUnwatchedEpisode) break;
    }

    return {
      totalEpisodes,
      watchedEpisodes,
      currentSeason: nextUnwatchedEpisode?.season || 1,
      currentEpisode: nextUnwatchedEpisode?.episode || 1,
      nextUnwatchedEpisode,
    };
  } catch (error) {
    console.error("Failed to get progress:", error);
    return null;
  }
}

/**
 * Clear all episode data for a TV show (when removing from watchlist)
 */
export async function clearEpisodesForShow(tmdbId: number): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("user_episodes")
    .delete()
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId);

  if (error) {
    throw new Error(`Failed to clear episodes: ${error.message}`);
  }
}
