import { useEffect, useState } from "react";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";
import type { Movie, TVShow } from "@/lib/tmbd/tmdb";

export function useMediaCardState(item: Movie | TVShow, type: "movie" | "tv") {
  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
    getWatchlistItem,
    loadWatchlist,
    initialized,
  } = useWatchlistStore();

  const [isLoading, setIsLoading] = useState(false);
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);
  const [isWatchedLoading, setIsWatchedLoading] = useState(false);
  const [optimisticWatched, setOptimisticWatched] = useState<boolean | null>(
    null,
  );

  // Computed values
  const actualInWatchlist = isInWatchlist(item.id, type);
  const displayInWatchlist =
    optimisticState !== null ? optimisticState : actualInWatchlist;

  const watchlistItem = getWatchlistItem(item.id, type);
  const actualWatched = watchlistItem?.watched || false;
  const displayWatched =
    optimisticWatched !== null ? optimisticWatched : actualWatched;

  // Load watchlist on first mount
  useEffect(() => {
    if (!initialized) {
      loadWatchlist();
    }
  }, [initialized, loadWatchlist]);

  // Reset optimistic states when actual states change
  useEffect(() => {
    if (optimisticState !== null && optimisticState === actualInWatchlist) {
      setOptimisticState(null);
    }
  }, [actualInWatchlist, optimisticState]);

  useEffect(() => {
    if (optimisticWatched !== null && optimisticWatched === actualWatched) {
      setOptimisticWatched(null);
    }
  }, [actualWatched, optimisticWatched]);

  const handleToggleWatchlist = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const newState = !displayInWatchlist;
    setOptimisticState(newState);

    try {
      if (actualInWatchlist) {
        await removeFromWatchlist(item.id, type);
      } else {
        await addToWatchlist(item, type);
      }
    } catch {
      setOptimisticState(!newState);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWatched = async () => {
    if (isWatchedLoading) return;

    // If not in watchlist, add it first as watched
    if (!actualInWatchlist) {
      setIsLoading(true);
      setOptimisticState(true);
      setOptimisticWatched(true);

      try {
        // Add to watchlist as watched - this will handle TV shows properly
        await addToWatchlist(item, type, true);
      } catch {
        setOptimisticState(null);
        setOptimisticWatched(null);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If in watchlist, toggle watched status
    if (watchlistItem) {
      setIsWatchedLoading(true);
      const newWatchedState = !displayWatched;
      setOptimisticWatched(newWatchedState);

      try {
        await updateWatchlistItem(watchlistItem.id, {
          watched: newWatchedState,
        });
        setOptimisticWatched(null);
      } catch {
        setOptimisticWatched(!newWatchedState);
      } finally {
        setIsWatchedLoading(false);
      }
    }
  };

  return {
    displayInWatchlist,
    displayWatched,
    isLoading,
    isWatchedLoading,
    handleToggleWatchlist,
    handleToggleWatched,
  };
}
