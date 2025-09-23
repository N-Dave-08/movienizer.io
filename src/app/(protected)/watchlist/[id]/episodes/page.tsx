"use client";

import { ArrowLeft, CheckCheck, Grid3X3, List, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { EpisodeCard } from "@/app/(protected)/watchlist/_components/episode-card";
import {
  getEpisodesForSeason,
  getSeasonsForShow,
  toggleEpisodeWatched,
  toggleSeasonWatched,
} from "@/lib/services/episode-service";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";
import type {
  SimpleEpisode,
  SimpleSeason,
  WatchlistItem,
} from "@/lib/types/database";

export default function EpisodesPage() {
  const params = useParams();
  const { items, refreshWatchlistItem } = useWatchlistStore();

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasons, setSeasons] = useState<SimpleSeason[]>([]);
  const [episodes, setEpisodes] = useState<SimpleEpisode[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"detailed" | "compact">("compact");
  const [loadingEpisodes, setLoadingEpisodes] = useState<Set<string>>(
    new Set(),
  );
  const [seasonLoading, setSeasonLoading] = useState(false);
  const requestIdRef = useRef(0);

  // Find the watchlist item
  const watchlistItem = items.find((item) => item.id === params.id) as
    | WatchlistItem
    | undefined;

  // Extract stable values to avoid unnecessary re-renders
  const tmdbId = watchlistItem?.tmdb_id;
  const mediaType = watchlistItem?.media_type;

  const loadSeasons = useCallback(async () => {
    if (!tmdbId) return;

    setLoading(true);
    try {
      const seasonsData = await getSeasonsForShow(tmdbId);
      setSeasons(seasonsData);

      // Set initial season to 1 (or could get from progress if needed)
      setSelectedSeason(1);
    } catch (error) {
      console.error("Failed to load seasons:", error);
    } finally {
      setLoading(false);
    }
  }, [tmdbId]);

  const loadEpisodes = useCallback(
    async (seasonNumber: number) => {
      if (!tmdbId) return;

      // Don't show loading state, just load in background
      try {
        const episodesData = await getEpisodesForSeason(tmdbId, seasonNumber);
        setEpisodes(episodesData);
      } catch (error) {
        console.error("Failed to load episodes:", error);
      }
    },
    [tmdbId],
  );

  // Load data when page loads
  useEffect(() => {
    if (tmdbId) {
      loadSeasons();
    }
  }, [tmdbId, loadSeasons]);

  // Load episodes when season changes
  useEffect(() => {
    if (tmdbId && selectedSeason) {
      loadEpisodes(selectedSeason);
    }
  }, [tmdbId, selectedSeason, loadEpisodes]);

  const handleEpisodeUpdate = useCallback(() => {
    // Reload episodes after episode update
    loadEpisodes(selectedSeason);
  }, [loadEpisodes, selectedSeason]);

  const handleEpisodeToggle = useCallback(
    async (seasonNumber: number, episodeNumber: number, watched: boolean) => {
      if (!tmdbId || !mediaType) return;

      const episodeKey = `${seasonNumber}-${episodeNumber}`;

      // Prevent multiple simultaneous updates for the same episode
      if (loadingEpisodes.has(episodeKey)) return;

      // Add episode to loading set
      setLoadingEpisodes((prev) => new Set(prev).add(episodeKey));

      // Update the local episode state immediately (optimistic update)
      setEpisodes((prevEpisodes) =>
        prevEpisodes.map((ep) =>
          ep.season_number === seasonNumber &&
          ep.episode_number === episodeNumber
            ? { ...ep, watched }
            : ep,
        ),
      );

      try {
        const result = await toggleEpisodeWatched(
          tmdbId,
          seasonNumber,
          episodeNumber,
          watched,
        );

        // If the watchlist status was updated, refresh the watchlist item
        if (result.watchlistUpdated) {
          await refreshWatchlistItem(tmdbId, mediaType);
        }
      } catch (error) {
        console.error("Failed to update episode:", error);
        // Revert optimistic update on error
        setEpisodes((prevEpisodes) =>
          prevEpisodes.map((ep) =>
            ep.season_number === seasonNumber &&
            ep.episode_number === episodeNumber
              ? { ...ep, watched: !watched }
              : ep,
          ),
        );
      } finally {
        // Remove episode from loading set
        setLoadingEpisodes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(episodeKey);
          return newSet;
        });
      }
    },
    [tmdbId, mediaType, loadingEpisodes, refreshWatchlistItem],
  );

  const handleMarkAllWatched = useCallback(
    async (watched: boolean) => {
      if (seasonLoading) return;

      const currentRequestId = ++requestIdRef.current;
      const season = seasons.find((s) => s.season_number === selectedSeason);
      if (!season || !tmdbId || !mediaType) return;

      setSeasonLoading(true);

      // Update local state optimistically
      const updatedEpisodes = episodes.map((ep) => ({ ...ep, watched }));
      setEpisodes(updatedEpisodes);

      try {
        const result = await toggleSeasonWatched(
          tmdbId,
          selectedSeason,
          season.episodes.length,
          watched,
        );

        // If the watchlist status was updated, refresh the watchlist item
        if (result.watchlistUpdated) {
          await refreshWatchlistItem(tmdbId, mediaType);
        }

        // Only update if this is still the current request
        if (currentRequestId === requestIdRef.current) {
          handleEpisodeUpdate();
        }
      } catch (error) {
        console.error("Failed to mark season as watched:", error);
        // Revert on error
        const revertedEpisodes = episodes.map((ep) => {
          const originalEp = season.episodes.find(
            (seasonEp) =>
              seasonEp.season_number === ep.season_number &&
              seasonEp.episode_number === ep.episode_number,
          );
          return originalEp ? { ...ep, watched: originalEp.watched } : ep;
        });
        setEpisodes(revertedEpisodes);
      } finally {
        setSeasonLoading(false);
      }
    },
    [
      seasons,
      tmdbId,
      mediaType,
      episodes,
      selectedSeason,
      handleEpisodeUpdate,
      seasonLoading,
      refreshWatchlistItem,
    ],
  );

  if (!watchlistItem || mediaType !== "tv") {
    return null; // Just return nothing if item not found or not a TV show
  }

  const unwatchedCount = episodes.filter((ep) => !ep.watched).length;
  const watchedCount = episodes.filter((ep) => ep.watched).length;

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">{watchlistItem.title}</h3>
              <p className="text-sm text-base-content/70">Episode Management</p>
            </div>
            <Link href="/watchlist" className="btn btn-sm btn-circle btn-ghost">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              {/* Season Selector */}
              <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
                {seasons.map((season) => (
                  <button
                    key={season.season_number}
                    type="button"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedSeason === season.season_number
                        ? "bg-primary text-primary-content shadow-md"
                        : "bg-base-200 text-base-content hover:bg-base-300 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedSeason(season.season_number)}
                  >
                    Season {season.season_number}
                    <span className="ml-1 text-xs opacity-70">
                      ({season.episode_count})
                    </span>
                  </button>
                ))}
              </div>

              {/* Season Actions */}
              {episodes.length > 0 && (
                <div className="flex items-center justify-between gap-2 mb-4 ">
                  {/* View Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-base-content/70">View:</span>
                    <div className="join space-x-2">
                      <button
                        type="button"
                        className={`btn btn-sm join-item ${viewMode === "compact" ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setViewMode("compact")}
                      >
                        <Grid3X3 className="w-4 h-4" />
                        Numbers
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm join-item ${viewMode === "detailed" ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setViewMode("detailed")}
                      >
                        <List className="w-4 h-4" />
                        Detailed
                      </button>
                    </div>
                  </div>

                  <div className=" flex items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => handleMarkAllWatched(true)}
                      disabled={unwatchedCount === 0 || seasonLoading}
                    >
                      <CheckCheck className="w-4 h-4" />({unwatchedCount})
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => handleMarkAllWatched(false)}
                      disabled={watchedCount === 0 || seasonLoading}
                    >
                      <RotateCcw className="w-4 h-4" />({watchedCount})
                    </button>
                  </div>
                </div>
              )}

              {/* Episodes */}
              <div>
                {viewMode === "compact" ? (
                  <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-1 p-2 animate-in fade-in duration-300">
                    {episodes.map((episode) => {
                      const episodeKey = `${episode.season_number}-${episode.episode_number}`;
                      const isLoading = loadingEpisodes.has(episodeKey);

                      return (
                        <button
                          key={episodeKey}
                          type="button"
                          onClick={() =>
                            handleEpisodeToggle(
                              episode.season_number,
                              episode.episode_number,
                              !episode.watched,
                            )
                          }
                          disabled={isLoading}
                          className={`aspect-square rounded border flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-105 relative ${
                            episode.watched
                              ? "bg-success text-success-content border-success shadow-sm"
                              : "bg-base-300 text-base-content border-base-400 hover:bg-base-200"
                          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                          title={episode.name}
                        >
                          {episode.episode_number}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-3 animate-in fade-in duration-300">
                    {episodes.map((episode) => (
                      <EpisodeCard
                        key={`${episode.season_number}-${episode.episode_number}`}
                        episode={episode}
                        tvId={tmdbId || 0}
                        onEpisodeToggle={handleEpisodeToggle}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
