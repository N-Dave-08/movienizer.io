"use client";

import { Calendar, Eye, EyeOff, List, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEpisodeProgress } from "@/lib/hooks/use-episode-progress";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";
import { getImageUrl } from "@/lib/tmbd/tmdb";
import type { WatchlistItem } from "@/lib/types/database";
import { ProgressIndicator } from "./progress-indicator";

interface WatchlistCardListProps {
  item: WatchlistItem;
}

export function WatchlistCardList({ item }: WatchlistCardListProps) {
  const { removeFromWatchlist, updateWatchlistItem } = useWatchlistStore();
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticWatched, setOptimisticWatched] = useState<boolean | null>(
    null,
  );

  const posterUrl = getImageUrl(item.poster_path, "w300");
  const isTV = item.media_type === "tv";
  const year = item.release_date
    ? new Date(item.release_date).getFullYear()
    : null;

  // Get real-time episode progress for TV shows
  const {
    progress,
    loading: progressLoading,
    refresh: refreshProgress,
  } = useEpisodeProgress(item.tmdb_id, item.media_type);

  // Use optimistic state if available, otherwise use actual state
  const displayWatched =
    optimisticWatched !== null ? optimisticWatched : item.watched;

  const handleToggleWatched = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const newWatchedState = !displayWatched;
    setOptimisticWatched(newWatchedState);

    try {
      await updateWatchlistItem(item.id, { watched: newWatchedState });
      setOptimisticWatched(null);
      // Refresh episode progress for TV shows
      if (isTV) {
        await refreshProgress();
      }
    } catch {
      setOptimisticWatched(!newWatchedState);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    await removeFromWatchlist(item.tmdb_id, item.media_type);
  };

  return (
    <div className="group relative flex items-center gap-4 p-4 bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg border border-base-300">
      {/* Poster thumbnail */}
      <div className="relative w-16 h-24 flex-shrink-0 bg-base-300 rounded overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.title}
            fill
            className={`object-cover border ${displayWatched ? "border-success border-2" : "border-base-300"}`}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJvHfF2E0Y8nQSa7qdNEPOPYDf8AjWb3MeOw5e7K7cJy7zIlnqy8Yf8ABSr3H1w2WJJl0w2y2nSJz/"
          />
        ) : (
          <div className="w-full h-full bg-base-300 flex items-center justify-center">
            <span className="text-xs text-base-content/50">No Image</span>
          </div>
        )}

        {/* Watched overlay for thumbnail */}
        {/* {displayWatched && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-success text-success-content px-1 py-0.5 rounded text-xs font-medium">
              Watched
            </div>
          </div>
        )} */}
      </div>

      <div className=" w-full">
        {/* Content */}
        <div className="flex-1 min-w-0 ">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-semibold text-lg truncate mb-1">
              {item.title}
            </h3>
            <span
              className={`badge badge-sm ${isTV ? "badge-secondary" : "badge-accent"}`}
            >
              {isTV ? "Series" : "Movie"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-base-content/70 mb-2">
            {year && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{year}</span>
              </div>
            )}
          </div>

          {/* Progress for TV shows */}
          {isTV &&
            progress &&
            !displayWatched &&
            progress.totalEpisodes > 0 && (
              <div className="mb-2">
                <ProgressIndicator
                  progress={progress}
                  compact
                  isLoading={progressLoading || isLoading}
                />
              </div>
            )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center  gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          {isTV && (
            <Link
              href={`/watchlist/${item.id}/episodes`}
              className="p-2 rounded-full bg-base-300 hover:bg-primary/80 active:bg-primary transition-colors touch-manipulation"
              title="View episodes"
              aria-label="View episodes"
            >
              <List className="w-4 h-4" />
            </Link>
          )}

          <button
            type="button"
            onClick={handleToggleWatched}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors touch-manipulation ${
              displayWatched
                ? "bg-success/80 hover:bg-success active:bg-success"
                : "bg-base-300 hover:bg-base-200 active:bg-base-200"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            title={displayWatched ? "Mark as unwatched" : "Mark as watched"}
            aria-label={
              displayWatched ? "Mark as unwatched" : "Mark as watched"
            }
          >
            {displayWatched ? (
              <EyeOff className="w-4 h-4 text-white" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-full bg-base-300 hover:bg-red-500/80 active:bg-red-600/80 transition-colors touch-manipulation"
            title="Remove from watchlist"
            aria-label="Remove from watchlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
