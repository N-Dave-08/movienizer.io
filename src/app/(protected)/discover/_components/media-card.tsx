"use client";

import { Bookmark } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";
import { getImageUrl, type Movie, type TVShow } from "@/lib/tmbd/tmdb";

interface MediaCardProps {
  item: Movie | TVShow;
  type: "movie" | "tv";
}

export function MediaCard({ item, type }: MediaCardProps) {
  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    loadWatchlist,
    initialized,
  } = useWatchlistStore();

  const [isLoading, setIsLoading] = useState(false);
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);

  const title =
    type === "movie" ? (item as Movie).title : (item as TVShow).name;
  const posterUrl = getImageUrl(item.poster_path, "w300");

  // Use optimistic state if available, otherwise use actual state
  const actualInWatchlist = isInWatchlist(item.id, type);
  const displayInWatchlist =
    optimisticState !== null ? optimisticState : actualInWatchlist;

  // Load watchlist on first mount
  useEffect(() => {
    if (!initialized) {
      loadWatchlist();
    }
  }, [initialized, loadWatchlist]);

  // Reset optimistic state when actual state changes
  useEffect(() => {
    if (optimisticState !== null && optimisticState === actualInWatchlist) {
      setOptimisticState(null);
    }
  }, [actualInWatchlist, optimisticState]);

  const handleToggleWatchlist = async () => {
    if (isLoading) return; // Prevent double clicks

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
      // Revert optimistic state on error
      setOptimisticState(!newState);
      // Error is handled by the store, just revert optimistic state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <figure className="group relative w-52 h-72 bg-base-100 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 rounded-sm">
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt={title}
          width={300}
          height={320}
          className="w-52 h-72 object-fill rounded-sm"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJvHfF2E0Y8nQSa7qdNEPOPYDf8AjWb3MeOw5e7K7cJy7zIlnqy8Yf8ABSr3H1w2WJJl0w2y2nSJz/"
        />
      ) : (
        <div className="w-52 h-72 bg-base-300 flex items-center justify-center">
          <span className="text-base-content/50">No Image</span>
        </div>
      )}
      <div
        className={`absolute top-2 right-2 transition-opacity duration-200 ${
          displayInWatchlist
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={handleToggleWatchlist}
          className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors backdrop-blur-sm"
          title={
            displayInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
          }
          disabled={isLoading}
        >
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              displayInWatchlist ? "fill-accent text-accent" : "text-white"
            }`}
          />
        </button>
      </div>
    </figure>
  );
}
