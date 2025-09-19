"use client";

import { CheckCheck, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  getEpisodesForSeason,
  getSeasonsForShow,
  getWatchlistProgress,
  toggleSeasonWatched,
} from "@/lib/episodes/simple-episode-service";
import { createClient } from "@/lib/supabase/client";
import type {
  EpisodeProgress,
  SimpleEpisode,
  SimpleSeason,
  WatchlistItem,
} from "@/lib/types/database";
import { EpisodeCard } from "./episode-card";
import { ProgressIndicator } from "./progress-indicator";

interface EpisodeModalProps {
  watchlistItem: WatchlistItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EpisodeModal({
  watchlistItem,
  isOpen,
  onClose,
}: EpisodeModalProps) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasons, setSeasons] = useState<SimpleSeason[]>([]);
  const [episodes, setEpisodes] = useState<SimpleEpisode[]>([]);
  const [progress, setProgress] = useState<EpisodeProgress | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to get fresh watchlist data from database
  const loadFreshWatchlistData = useCallback(async () => {
    if (!watchlistItem) return [];

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("watchlist_items")
      .select("watched_episodes_list")
      .eq("user_id", user.id)
      .eq("tmdb_id", watchlistItem.tmdb_id)
      .eq("media_type", "tv")
      .single();

    if (error || !data) {
      console.error("Failed to fetch fresh watchlist data:", error);
      return watchlistItem.watched_episodes_list || [];
    }

    const freshList = data.watched_episodes_list || [];
    return freshList;
  }, [watchlistItem]);

  const loadSeasons = useCallback(async () => {
    if (!watchlistItem) return;

    setLoading(true);
    try {
      const freshWatchedList = await loadFreshWatchlistData();
      const seasonsData = await getSeasonsForShow(
        watchlistItem.tmdb_id,
        freshWatchedList,
      );
      setSeasons(seasonsData);

      // Set initial season based on progress or default to 1
      const initialSeason = watchlistItem.current_season || 1;
      setSelectedSeason(initialSeason);
    } catch (error) {
      console.error("Failed to load seasons:", error);
    } finally {
      setLoading(false);
    }
  }, [watchlistItem, loadFreshWatchlistData]);

  const loadEpisodes = useCallback(
    async (seasonNumber: number) => {
      if (!watchlistItem) return;

      // Don't show loading state, just load in background
      try {
        const freshWatchedList = await loadFreshWatchlistData();
        const episodesData = await getEpisodesForSeason(
          watchlistItem.tmdb_id,
          seasonNumber,
          freshWatchedList,
        );
        setEpisodes(episodesData);
      } catch (error) {
        console.error("Failed to load episodes:", error);
      }
    },
    [watchlistItem, loadFreshWatchlistData],
  );

  const loadProgress = useCallback(async () => {
    if (!watchlistItem) return;

    try {
      const progressData = await getWatchlistProgress(watchlistItem.tmdb_id);
      setProgress(progressData);
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  }, [watchlistItem]);

  // Load seasons when modal opens
  useEffect(() => {
    if (isOpen && watchlistItem) {
      loadSeasons();
      loadProgress();
    }
  }, [isOpen, watchlistItem, loadSeasons, loadProgress]);

  // Load episodes when season changes
  useEffect(() => {
    if (isOpen && watchlistItem && selectedSeason) {
      loadEpisodes(selectedSeason);
    }
  }, [isOpen, watchlistItem, selectedSeason, loadEpisodes]);

  const handleEpisodeUpdate = useCallback(() => {
    // Reload episodes and progress after episode update
    loadEpisodes(selectedSeason);
    loadProgress();
  }, [loadEpisodes, loadProgress, selectedSeason]);

  const handleEpisodeToggle = useCallback(
    (seasonNumber: number, episodeNumber: number, watched: boolean) => {
      // Update the local episode state immediately
      setEpisodes((prevEpisodes) =>
        prevEpisodes.map((ep) =>
          ep.season_number === seasonNumber &&
          ep.episode_number === episodeNumber
            ? { ...ep, watched }
            : ep,
        ),
      );

      // Also update progress
      loadProgress();
    },
    [loadProgress],
  );

  const handleMarkAllWatched = useCallback(
    async (watched: boolean) => {
      if (!watchlistItem) return;

      // Optimistically update all episodes in the current season
      const optimisticEpisodes = episodes.map((episode) => ({
        ...episode,
        watched: watched,
      }));
      setEpisodes(optimisticEpisodes);

      try {
        const currentSeason = seasons.find(
          (s) => s.season_number === selectedSeason,
        );
        if (currentSeason) {
          await toggleSeasonWatched(
            watchlistItem.tmdb_id,
            selectedSeason,
            currentSeason.episode_count,
            watched,
          );
        }

        // Reload fresh data after successful update
        handleEpisodeUpdate();
      } catch (error) {
        console.error("Failed to update episodes:", error);

        // Revert optimistic update on error
        const revertedEpisodes = episodes.map((episode) => ({
          ...episode,
          watched: !watched,
        }));
        setEpisodes(revertedEpisodes);
      }
    },
    [watchlistItem, selectedSeason, seasons, episodes, handleEpisodeUpdate],
  );

  if (!watchlistItem || watchlistItem.media_type !== "tv") {
    return null;
  }

  const unwatchedCount = episodes.filter((ep) => !ep.watched).length;
  const watchedCount = episodes.filter((ep) => ep.watched).length;

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-11/12 max-w-6xl h-5/6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">{watchlistItem.title}</h3>
            <p className="text-sm text-base-content/70">Episode Management</p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overall Progress */}
        {progress && (
          <div className="mb-6 p-4 bg-base-200 rounded-lg">
            <ProgressIndicator progress={progress} />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* Season Selector */}
            <div className="tabs tabs-bordered mb-4 overflow-x-auto">
              {seasons.map((season) => (
                <button
                  key={season.season_number}
                  type="button"
                  className={`tab ${selectedSeason === season.season_number ? "tab-active" : ""}`}
                  onClick={() => setSelectedSeason(season.season_number)}
                >
                  Season {season.season_number}
                  <span className="ml-1 text-xs opacity-60">
                    ({season.episode_count})
                  </span>
                </button>
              ))}
            </div>

            {/* Season Actions */}
            {episodes.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => handleMarkAllWatched(true)}
                  disabled={unwatchedCount === 0}
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All Watched ({unwatchedCount})
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => handleMarkAllWatched(false)}
                  disabled={watchedCount === 0}
                >
                  <RotateCcw className="w-4 h-4" />
                  Mark All Unwatched ({watchedCount})
                </button>

                <div className="ml-auto text-sm text-base-content/70 transition-all duration-200">
                  {watchedCount}/{episodes.length} episodes watched
                </div>
              </div>
            )}

            {/* Episodes Grid */}
            {episodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto animate-in fade-in duration-300">
                {episodes.map((episode) => (
                  <EpisodeCard
                    key={`S${episode.season_number}E${episode.episode_number}`}
                    episode={episode}
                    tvId={watchlistItem.tmdb_id}
                    onEpisodeToggle={handleEpisodeToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-base-content/60 animate-in fade-in duration-300">
                <p>No episodes found for Season {selectedSeason}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
}
