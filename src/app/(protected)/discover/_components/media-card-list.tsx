"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Tv } from "lucide-react";
import Image from "next/image";
import {
  getImageUrl,
  getTVShowWithSeasons,
  type Movie,
  type TVShow,
} from "@/lib/tmbd/tmdb";
import { useMediaCardState } from "../_hooks/use-media-card-state";
import { MediaCardButtonsList } from "./media-card-buttons-list";

interface MediaCardListProps {
  item: Movie | TVShow;
  type: "movie" | "tv";
}

export function MediaCardList({ item, type }: MediaCardListProps) {
  const {
    displayInWatchlist,
    displayWatched,
    isLoading,
    isWatchedLoading,
    handleToggleWatchlist,
    handleToggleWatched,
  } = useMediaCardState(item, type);

  // Fetch TV show details to get episode count
  const { data: tvDetails } = useQuery({
    queryKey: ["tv-details", item.id],
    queryFn: () => getTVShowWithSeasons(item.id),
    enabled: type === "tv",
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const title =
    type === "movie" ? (item as Movie).title : (item as TVShow).name;
  const releaseDate =
    type === "movie"
      ? (item as Movie).release_date
      : (item as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const posterUrl = getImageUrl(item.poster_path, "w300");
  const isTV = type === "tv";

  return (
    <div className="group relative flex items-center gap-4 p-4 bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg border border-base-300">
      {/* Poster thumbnail */}
      <div className="relative w-16 h-24 flex-shrink-0 bg-base-300 rounded overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
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
      </div>

      <div className="flex-1 min-w-0">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg truncate flex-1 min-w-0">
              {title}
            </h3>
            <span
              className={`badge badge-sm flex-shrink-0 ${isTV ? "badge-secondary" : "badge-accent"}`}
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
            {type === "tv" && tvDetails?.number_of_episodes && (
              <div className="flex items-center gap-1">
                <Tv className="w-4 h-4" />
                <span>{tvDetails.number_of_episodes} episodes</span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons - always visible in list mode */}
        <div className="flex items-center gap-2 opacity-100 transition-opacity duration-200">
          <MediaCardButtonsList
            displayWatched={displayWatched}
            displayInWatchlist={displayInWatchlist}
            isLoading={isLoading}
            isWatchedLoading={isWatchedLoading}
            onToggleWatched={handleToggleWatched}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </div>
      </div>
    </div>
  );
}
