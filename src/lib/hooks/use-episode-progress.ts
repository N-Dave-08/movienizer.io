"use client";

import { useEffect, useState } from "react";
import { getWatchlistProgress } from "@/lib/services/episode-service";
import type { EpisodeProgress } from "@/lib/types/database";

/**
 * Hook to get real-time episode progress from the user_episodes table
 */
export function useEpisodeProgress(tmdbId: number, mediaType: "movie" | "tv") {
  const [progress, setProgress] = useState<EpisodeProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mediaType !== "tv") {
      setProgress(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProgress = async () => {
      try {
        setLoading(true);
        const progressData = await getWatchlistProgress(tmdbId);
        if (isMounted) {
          setProgress(progressData);
        }
      } catch (error) {
        console.error("Failed to fetch episode progress:", error);
        if (isMounted) {
          setProgress(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProgress();

    return () => {
      isMounted = false;
    };
  }, [tmdbId, mediaType]);

  // Refresh function that can be called manually
  const refresh = async () => {
    if (mediaType !== "tv") return;

    try {
      setLoading(true);
      const progressData = await getWatchlistProgress(tmdbId);
      setProgress(progressData);
    } catch (error) {
      console.error("Failed to refresh episode progress:", error);
    } finally {
      setLoading(false);
    }
  };

  return { progress, loading, refresh };
}
