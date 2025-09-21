"use client";

import Image from "next/image";
import { getImageUrl, type Movie, type TVShow } from "@/lib/tmbd/tmdb";
import { useMediaCardState } from "../_hooks/use-media-card-state";
import { MediaCardButtons } from "./media-card-buttons";
import { WatchedOverlay } from "./watched-overlay";

interface MediaCardProps {
  item: Movie | TVShow;
  type: "movie" | "tv";
}

export function MediaCard({ item, type }: MediaCardProps) {
  const {
    displayInWatchlist,
    displayWatched,
    isLoading,
    isWatchedLoading,
    handleToggleWatchlist,
    handleToggleWatched,
  } = useMediaCardState(item, type);

  const title =
    type === "movie" ? (item as Movie).title : (item as TVShow).name;
  const posterUrl = getImageUrl(item.poster_path, "w300");

  return (
    <figure className="group relative w-full aspect-[2/3] bg-base-100 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 rounded-sm">
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt={title}
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

      <WatchedOverlay isWatched={displayWatched} />

      <MediaCardButtons
        displayWatched={displayWatched}
        displayInWatchlist={displayInWatchlist}
        isLoading={isLoading}
        isWatchedLoading={isWatchedLoading}
        onToggleWatched={handleToggleWatched}
        onToggleWatchlist={handleToggleWatchlist}
      />
    </figure>
  );
}
