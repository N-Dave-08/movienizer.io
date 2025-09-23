import { useCallback, useEffect, useRef, useState } from "react";
import {
  getEpisodesForSeason,
  getSeasonsForShow,
  toggleEpisodeWatched,
  toggleSeasonWatched,
} from "@/lib/services/episode-service";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";
import type { SimpleEpisode, SimpleSeason } from "@/lib/types/database";

interface UseEpisodeManagementProps {
  tmdbId?: number;
  mediaType?: "movie" | "tv";
}

export function useEpisodeManagement({
  tmdbId,
  mediaType,
}: UseEpisodeManagementProps) {
  const { refreshWatchlistItem } = useWatchlistStore();

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasons, setSeasons] = useState<SimpleSeason[]>([]);
  const [episodes, setEpisodes] = useState<SimpleEpisode[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEpisodes, setLoadingEpisodes] = useState<Set<string>>(
    new Set(),
  );
  const [seasonLoading, setSeasonLoading] = useState(false);
  const requestIdRef = useRef(0);

  const loadSeasons = useCallback(async () => {
    if (!tmdbId) return;

    setLoading(true);
    try {
      const seasonsData = await getSeasonsForShow(tmdbId);
      setSeasons(seasonsData);
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

      try {
        const episodesData = await getEpisodesForSeason(tmdbId, seasonNumber);
        setEpisodes(episodesData);
      } catch (error) {
        console.error("Failed to load episodes:", error);
      }
    },
    [tmdbId],
  );

  const handleEpisodeUpdate = useCallback(() => {
    loadEpisodes(selectedSeason);
  }, [loadEpisodes, selectedSeason]);

  const handleEpisodeToggle = useCallback(
    async (seasonNumber: number, episodeNumber: number, watched: boolean) => {
      if (!tmdbId || !mediaType) return;

      const episodeKey = `${seasonNumber}-${episodeNumber}`;

      if (loadingEpisodes.has(episodeKey)) return;

      setLoadingEpisodes((prev) => new Set(prev).add(episodeKey));

      // Optimistic update
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

        if (result.watchlistUpdated) {
          await refreshWatchlistItem(tmdbId, mediaType);
        }
      } catch (error) {
        console.error("Failed to update episode:", error);
        // Revert optimistic update
        setEpisodes((prevEpisodes) =>
          prevEpisodes.map((ep) =>
            ep.season_number === seasonNumber &&
            ep.episode_number === episodeNumber
              ? { ...ep, watched: !watched }
              : ep,
          ),
        );
      } finally {
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

      // Optimistic update
      const updatedEpisodes = episodes.map((ep) => ({ ...ep, watched }));
      setEpisodes(updatedEpisodes);

      try {
        const result = await toggleSeasonWatched(
          tmdbId,
          selectedSeason,
          season.episodes.length,
          watched,
        );

        if (result.watchlistUpdated) {
          await refreshWatchlistItem(tmdbId, mediaType);
        }

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

  const unwatchedCount = episodes.filter((ep) => !ep.watched).length;
  const watchedCount = episodes.filter((ep) => ep.watched).length;

  return {
    selectedSeason,
    setSelectedSeason,
    seasons,
    episodes,
    loading,
    loadingEpisodes,
    seasonLoading,
    handleEpisodeToggle,
    handleMarkAllWatched,
    unwatchedCount,
    watchedCount,
  };
}
