"use client";

import { createClient } from "@/lib/supabase/client";
import { getTVSeason, getTVShowWithSeasons } from "@/lib/tmbd/api";
import type { TVSeasonDetails, TVShowDetails } from "@/lib/tmbd/types";
import type {
  EpisodeProgress,
  SimpleEpisode,
  SimpleSeason,
} from "@/lib/types/database";

/**
 * Simple Episode Service
 *
 * Tracks only which episodes are watched using a JSON array approach.
 * Much simpler than separate tables - just stores ["S1E1", "S1E2", "S2E1"] etc.
 */

export async function getEpisodesForSeason(
  tvId: number,
  seasonNumber: number,
  watchedEpisodesList: string[] = [],
): Promise<SimpleEpisode[]> {
  // Get episode data from TMDB
  const seasonDetails: TVSeasonDetails = await getTVSeason(tvId, seasonNumber);

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
    watched: watchedEpisodesList.includes(
      `S${episode.season_number}E${episode.episode_number}`,
    ),
  }));
}

export async function getSeasonsForShow(
  tvId: number,
  watchedEpisodesList: string[] = [],
): Promise<SimpleSeason[]> {
  // Get show details from TMDB
  const tvDetails: TVShowDetails = await getTVShowWithSeasons(tvId);

  // Convert to simple format
  const seasons = await Promise.all(
    tvDetails.seasons
      .filter((season) => season.season_number > 0) // Skip specials
      .map(async (season) => {
        const episodes = await getEpisodesForSeason(
          tvId,
          season.season_number,
          watchedEpisodesList,
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

export async function toggleEpisodeWatched(
  tvId: number,
  seasonNumber: number,
  episodeNumber: number,
  watched: boolean,
): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.rpc("toggle_episode_watched", {
    p_user_id: user.id,
    p_tmdb_id: tvId,
    p_season: seasonNumber,
    p_episode: episodeNumber,
    p_watched: watched,
  });

  if (error) {
    throw new Error(`Failed to update episode: ${error.message}`);
  }
}

export async function toggleSeasonWatched(
  tvId: number,
  seasonNumber: number,
  episodeCount: number,
  watched: boolean,
): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.rpc("toggle_season_watched", {
    p_user_id: user.id,
    p_tmdb_id: tvId,
    p_season: seasonNumber,
    p_episode_count: episodeCount,
    p_watched: watched,
  });

  if (error) {
    throw new Error(`Failed to update season: ${error.message}`);
  }
}

export async function markShowFullyWatched(
  tvId: number,
  totalEpisodes: number,
): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.rpc("mark_show_fully_watched", {
    p_user_id: user.id,
    p_tmdb_id: tvId,
    p_total_episodes: totalEpisodes,
  });

  if (error) {
    throw new Error(`Failed to mark show as watched: ${error.message}`);
  }
}

export async function getWatchlistProgress(
  tvId: number,
): Promise<EpisodeProgress | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: watchlistItem, error } = await supabase
    .from("watchlist_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("tmdb_id", tvId)
    .eq("media_type", "tv")
    .single();

  if (error || !watchlistItem) {
    return null;
  }

  const totalEpisodes = watchlistItem.total_episodes || 0;
  const watchedEpisodes = watchlistItem.watched_episodes || 0;
  const currentSeason = watchlistItem.current_season || 1;
  const currentEpisode = watchlistItem.current_episode || 1;
  const progressPercentage =
    totalEpisodes > 0 ? Math.round((watchedEpisodes / totalEpisodes) * 100) : 0;

  return {
    totalEpisodes,
    watchedEpisodes,
    currentSeason,
    currentEpisode,
    progressPercentage,
  };
}

// Helper function to calculate next unwatched episode
export function findNextUnwatchedEpisode(
  seasons: SimpleSeason[],
): { season: number; episode: number } | null {
  for (const season of seasons) {
    for (const episode of season.episodes) {
      if (!episode.watched) {
        return {
          season: episode.season_number,
          episode: episode.episode_number,
        };
      }
    }
  }
  return null; // All episodes watched
}
