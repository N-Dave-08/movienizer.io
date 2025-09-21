"use client";

import { Eye, EyeOff, List, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";
import { getImageUrl } from "@/lib/tmbd/tmdb";
import type { EpisodeProgress, WatchlistItem } from "@/lib/types/database";
import { ProgressIndicator } from "./progress-indicator";

interface WatchlistCardProps {
  item: WatchlistItem;
  onEpisodeView?: (item: WatchlistItem) => void;
}

export function WatchlistCard({ item, onEpisodeView }: WatchlistCardProps) {
  const { removeFromWatchlist, updateWatchlistItem } = useWatchlistStore();
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticWatched, setOptimisticWatched] = useState<boolean | null>(
    null,
  );

  const posterUrl = getImageUrl(item.poster_path, "w300");
  const isTV = item.media_type === "tv";

  // Use optimistic state if available, otherwise use actual state
  const displayWatched =
    optimisticWatched !== null ? optimisticWatched : item.watched;

  // Calculate progress for TV shows
  const progress: EpisodeProgress | null =
    isTV && item.total_episodes
      ? {
          totalEpisodes: item.total_episodes,
          watchedEpisodes: item.watched_episodes || 0,
          currentSeason: item.current_season || 1,
          currentEpisode: item.current_episode || 1,
          progressPercentage:
            item.total_episodes > 0
              ? Math.round(
                  ((item.watched_episodes || 0) / item.total_episodes) * 100,
                )
              : 0,
        }
      : null;

  const handleToggleWatched = async () => {
    if (isLoading) return; // Prevent double clicks

    setIsLoading(true);
    const newWatchedState = !displayWatched;
    setOptimisticWatched(newWatchedState);

    try {
      await updateWatchlistItem(item.id, { watched: newWatchedState });
      // Reset optimistic state after successful update
      setOptimisticWatched(null);
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

  const handleEpisodeView = () => {
    if (onEpisodeView) {
      onEpisodeView(item);
    }
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

      {/* Progress overlay for TV shows - only show if not watched and has progress */}
      {isTV && progress && !displayWatched && progress.totalEpisodes > 0 && (
        <div className="absolute bottom-14 md:bottom-0 left-0 right-0 p-2 ">
          <ProgressIndicator progress={progress} compact className="mb-1" />
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>
              S{progress.currentSeason}E{progress.currentEpisode}
            </span>
            <span>{Math.round(progress.progressPercentage)}%</span>
          </div>
        </div>
      )}

      {/* Bottom Action Bar - Mobile-friendly */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex justify-center gap-3 pt-2">
          {isTV && (
            <button
              type="button"
              onClick={handleEpisodeView}
              className="p-2 rounded-full bg-white/20 hover:bg-primary/80 active:bg-primary transition-colors backdrop-blur-sm touch-manipulation"
              title="View episodes"
              aria-label="View episodes"
            >
              <List className="w-4 h-4 text-white" />
            </button>
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
