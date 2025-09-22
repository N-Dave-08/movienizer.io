"use client";

import { Eye, EyeOff, List, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEpisodeProgress } from "@/lib/hooks/use-episode-progress";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";
import { getImageUrl } from "@/lib/tmbd/tmdb";
import type { WatchlistItem } from "@/lib/types/database";
import { ProgressIndicator } from "./progress-indicator";

interface WatchlistCardProps {
  item: WatchlistItem;
}

export function WatchlistCard({ item }: WatchlistCardProps) {
  const { removeFromWatchlist, updateWatchlistItem } = useWatchlistStore();
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticWatched, setOptimisticWatched] = useState<boolean | null>(
    null,
  );

  const posterUrl = getImageUrl(item.poster_path, "w300");
  const isTV = item.media_type === "tv";

  // Get real-time episode progress for TV shows
  const {
    progress,
    loading: progressLoading,
    refresh: refreshProgress,
  } = useEpisodeProgress(item.tmdb_id, item.media_type);

  // Use optimistic state if available, otherwise use actual state
  const displayWatched =
    optimisticWatched !== null ? optimisticWatched : item.watched;

  // Calculate progress percentage for display
  const progressPercentage =
    progress && progress.totalEpisodes > 0
      ? Math.round((progress.watchedEpisodes / progress.totalEpisodes) * 100)
      : 0;

  const handleToggleWatched = async () => {
    if (isLoading) return; // Prevent double clicks

    setIsLoading(true);
    const newWatchedState = !displayWatched;
    setOptimisticWatched(newWatchedState);

    try {
      await updateWatchlistItem(item.id, { watched: newWatchedState });
      // Reset optimistic state after successful update
      setOptimisticWatched(null);
      // Refresh episode progress for TV shows
      if (isTV) {
        await refreshProgress();
      }
    } catch {
      // Revert optimistic state on error
      setOptimisticWatched(!newWatchedState);
      // Error is handled by the store, just revert optimistic state
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    await removeFromWatchlist(item.tmdb_id, item.media_type);
  };

  return (
    <figure className="group relative w-full aspect-[2/3] bg-base-100 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 rounded-sm">
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt={item.title}
          fill
          className="object-cover rounded-sm"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJvHfF2E0Y8nQSa7qdNEPOPYDf8AjWb3MeOw5e7K7cJy7zIlnqy8Yf8ABSr3H1w2WJJl0w2y2nSJz/"
        />
      ) : (
        <div className="w-full h-full bg-base-300 flex items-center justify-center rounded-sm">
          <span className="text-base-content/50">No Image</span>
        </div>
      )}

      {/* Watched overlay */}
      {displayWatched && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-sm">
          <div className="bg-success text-success-content px-3 py-1 rounded-full text-sm font-medium">
            Watched
          </div>
        </div>
      )}

      {/* Progress Bar for TV Shows */}
      {isTV && progress && !displayWatched && progress.totalEpisodes > 0 && (
        <div className="absolute bottom-14 md:bottom-0 left-0 right-0 p-2 ">
          <ProgressIndicator
            progress={progress}
            compact
            className="mb-1"
            isLoading={progressLoading || isLoading}
          />
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>
              S{progress.currentSeason}E{progress.currentEpisode}
            </span>
            <span>{progressPercentage}%</span>
          </div>
        </div>
      )}

      {/* Bottom Action Bar - Mobile-friendly */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex justify-center gap-3 pt-2">
          {isTV && (
            <Link
              href={`/watchlist/${item.id}/episodes`}
              className="p-2 rounded-full bg-white/20 hover:bg-primary/80 active:bg-primary transition-colors backdrop-blur-sm touch-manipulation"
              title="View episodes"
              aria-label="View episodes"
            >
              <List className="w-4 h-4 text-white" />
            </Link>
          )}

          <button
            type="button"
            onClick={handleToggleWatched}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors backdrop-blur-sm touch-manipulation ${
              displayWatched
                ? "bg-success/80 hover:bg-success active:bg-success"
                : "bg-white/20 hover:bg-white/40 active:bg-white/60"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            title={displayWatched ? "Mark as unwatched" : "Mark as watched"}
            aria-label={
              displayWatched ? "Mark as unwatched" : "Mark as watched"
            }
          >
            {displayWatched ? (
              <EyeOff className="w-4 h-4 text-white" />
            ) : (
              <Eye className="w-4 h-4 text-white" />
            )}
          </button>

          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-full bg-white/20 hover:bg-red-500/80 active:bg-red-600/80 transition-colors backdrop-blur-sm touch-manipulation"
            title="Remove from watchlist"
            aria-label="Remove from watchlist"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </figure>
  );
}
