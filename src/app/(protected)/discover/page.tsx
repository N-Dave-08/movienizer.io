"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Film, RefreshCw, TrendingUp, Tv } from "lucide-react";
import { useState } from "react";
import { MediaCard } from "@/app/(protected)/discover/_components/media-card";
import { MediaSkeletonGrid } from "@/app/(protected)/discover/_components/media-skeleton";
import { getTrendingMovies, getTrendingTVShows } from "@/lib/tmbd/tmdb";

type TimeWindow = "day" | "week";
type ContentType = "movies" | "tv" | "all";

export default function Discover() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("week");
  const [contentType, setContentType] = useState<ContentType>("all");

  // Fetch trending movies
  const {
    data: moviesData,
    isLoading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useQuery({
    queryKey: ["trending-movies", timeWindow],
    queryFn: () => getTrendingMovies(timeWindow),
    enabled: contentType === "movies" || contentType === "all",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch trending TV shows
  const {
    data: tvData,
    isLoading: tvLoading,
    error: tvError,
    refetch: refetchTV,
  } = useQuery({
    queryKey: ["trending-tv", timeWindow],
    queryFn: () => getTrendingTVShows(timeWindow),
    enabled: contentType === "tv" || contentType === "all",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const movies = moviesData?.results || [];
  const tvShows = tvData?.results || [];
  const loading = moviesLoading || tvLoading;
  const error = moviesError || tvError;

  // Watchlist functionality is now handled directly in MediaCard component

  const handleRetry = () => {
    refetchMovies();
    refetchTV();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-8">
          {(contentType === "movies" || contentType === "all") && (
            <section>
              <div className="h-8 bg-base-300 rounded w-48 mb-6 animate-pulse"></div>
              <MediaSkeletonGrid count={8} />
            </section>
          )}
          {(contentType === "tv" || contentType === "all") && (
            <section>
              <div className="h-8 bg-base-300 rounded w-48 mb-6 animate-pulse"></div>
              <MediaSkeletonGrid count={8} />
            </section>
          )}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-error mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load content</h3>
          <p className="text-base-content/70 mb-4 text-center max-w-md">
            {error instanceof Error
              ? error.message
              : "Failed to fetch trending content"}
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="btn btn-primary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      );
    }

    const hasContent = movies.length > 0 || tvShows.length > 0;

    if (!hasContent) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="w-12 h-12 text-base-content/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No trending content found
          </h3>
          <p className="text-base-content/70 text-center max-w-md">
            Try adjusting your filters or check back later.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-12">
        {movies.length > 0 &&
          (contentType === "movies" || contentType === "all") && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Film className="w-6 h-6" />
                Trending Movies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <MediaCard key={movie.id} item={movie} type="movie" />
                ))}
              </div>
            </section>
          )}

        {tvShows.length > 0 &&
          (contentType === "tv" || contentType === "all") && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Tv className="w-6 h-6" />
                Trending TV Shows
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tvShows.map((tvShow) => (
                  <MediaCard key={tvShow.id} item={tvShow} type="tv" />
                ))}
              </div>
            </section>
          )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            Discover
          </h1>
          <p className="text-base-content/70 mt-2">
            Explore trending movies and TV shows
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-base-200 p-4 rounded-lg">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="font-medium">Time Period:</span>
          <div className="join space-x-2">
            <button
              type="button"
              className={`btn join-item btn-sm ${timeWindow === "day" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setTimeWindow("day")}
            >
              Today
            </button>
            <button
              type="button"
              className={`btn join-item btn-sm ${timeWindow === "week" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setTimeWindow("week")}
            >
              This Week
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="font-medium">Content:</span>
          <div className="join space-x-2">
            <button
              type="button"
              className={`btn join-item btn-sm ${contentType === "all" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setContentType("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`btn join-item btn-sm ${contentType === "movies" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setContentType("movies")}
            >
              Movies
            </button>
            <button
              type="button"
              className={`btn join-item btn-sm ${contentType === "tv" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setContentType("tv")}
            >
              TV Shows
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
