"use client";

import { Eye, EyeOff, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";
import { getImageUrl } from "@/lib/tmbd/tmdb";
import type { WatchlistItem } from "@/lib/types/database";

interface WatchlistCardProps {
  item: WatchlistItem;
}

export function WatchlistCard({ item }: WatchlistCardProps) {
  const { removeFromWatchlist, updateWatchlistItem } = useWatchlistStore();

  const posterUrl = getImageUrl(item.poster_path, "w300");
  const releaseYear = item.release_date
    ? new Date(item.release_date).getFullYear()
    : null;

  const handleRemove = async () => {
    await removeFromWatchlist(item.tmdb_id, item.media_type);
  };

  const handleToggleWatched = async () => {
    await updateWatchlistItem(item.id, { watched: !item.watched });
  };

  const handleRating = async (rating: number) => {
    const newRating = item.user_rating === rating ? null : rating;
    await updateWatchlistItem(item.id, { user_rating: newRating });
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <figure className="relative">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.title}
            width={300}
            height={320}
            className="w-full h-80 object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJvHfF2E0Y8nQSa7qdNEPOPYDf8AjWb3MeOw5e7K7cJy7zIlnqy8Yf8ABSr3H1w2WJJl0w2y2nSJz/"
          />
        ) : (
          <div className="w-full h-80 bg-base-300 flex items-center justify-center">
            <span className="text-base-content/50">No Image</span>
          </div>
        )}

        {/* Watched overlay */}
        {item.watched && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-success text-success-content px-3 py-1 rounded-full text-sm font-medium">
              Watched
            </div>
          </div>
        )}
      </figure>

      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="card-title text-lg font-bold text-base-content leading-tight">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge badge-outline badge-sm">
                {item.media_type === "movie" ? "Movie" : "TV Show"}
              </span>
              {releaseYear && (
                <span className="text-sm text-base-content/60">
                  {releaseYear}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={handleToggleWatched}
              className={`btn btn-circle btn-sm ${
                item.watched ? "btn-success" : "btn-ghost hover:btn-success"
              }`}
              title={item.watched ? "Mark as unwatched" : "Mark as watched"}
            >
              {item.watched ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleRemove}
              className="btn btn-circle btn-sm btn-ghost hover:btn-error"
              title="Remove from watchlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRating(rating)}
                className="btn btn-ghost btn-xs p-1 hover:btn-warning"
                title={`Rate ${rating} star${rating > 1 ? "s" : ""}`}
              >
                <Star
                  className={`w-3 h-3 ${
                    item.user_rating && rating <= item.user_rating
                      ? "fill-warning text-warning"
                      : "text-base-content/40"
                  }`}
                />
              </button>
            ))}
            {item.user_rating && (
              <span className="text-xs text-base-content/60 ml-1">
                ({item.user_rating}/5)
              </span>
            )}
          </div>
        </div>

        {/* TMDB Rating */}
        {item.vote_average && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-base-content/60">TMDB:</span>
              <div className="badge badge-sm">
                ⭐ {item.vote_average.toFixed(1)}
              </div>
            </div>
          </div>
        )}

        {/* Added date */}
        <div className="mt-3 pt-3 border-t border-base-300">
          <span className="text-xs text-base-content/50">
            Added {new Date(item.added_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
