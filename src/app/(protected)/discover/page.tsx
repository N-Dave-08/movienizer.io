"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Film,
  RefreshCw,
  Search,
  TrendingUp,
  Tv,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MediaCard } from "@/app/(protected)/discover/_components/media-card";
import { MediaSkeletonGrid } from "@/app/(protected)/discover/_components/media-skeleton";
import {
  getTrendingMovies,
  getTrendingTVShows,
  searchMovies,
  searchTVShows,
} from "@/lib/tmbd/tmdb";

type TimeWindow = "day" | "week";
type ContentType = "movies" | "tv" | "all";

// Custom hook for debounced search
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Discover() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("week");
  const [contentType, setContentType] = useState<ContentType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Determine if we're in search mode
  const isSearchMode = debouncedSearchQuery.trim().length > 0;

  // Fetch trending movies
  const {
    data: moviesData,
    isLoading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useQuery({
    queryKey: ["trending-movies", timeWindow],
    queryFn: () => getTrendingMovies(timeWindow),
    enabled:
      !isSearchMode && (contentType === "movies" || contentType === "all"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch trending Series
  const {
    data: tvData,
    isLoading: tvLoading,
    error: tvError,
    refetch: refetchTV,
  } = useQuery({
    queryKey: ["trending-tv", timeWindow],
    queryFn: () => getTrendingTVShows(timeWindow),
    enabled: !isSearchMode && (contentType === "tv" || contentType === "all"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Search movies
  const {
    data: searchMoviesData,
    isLoading: searchMoviesLoading,
    error: searchMoviesError,
    refetch: refetchSearchMovies,
  } = useQuery({
    queryKey: ["search-movies", debouncedSearchQuery],
    queryFn: () => searchMovies(debouncedSearchQuery),
    enabled:
      isSearchMode && (contentType === "movies" || contentType === "all"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Search Series
  const {
    data: searchTVData,
    isLoading: searchTVLoading,
    error: searchTVError,
    refetch: refetchSearchTV,
  } = useQuery({
    queryKey: ["search-tv", debouncedSearchQuery],
    queryFn: () => searchTVShows(debouncedSearchQuery),
    enabled: isSearchMode && (contentType === "tv" || contentType === "all"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Combine data based on mode
  const movies = useMemo(() => {
    if (isSearchMode) {
      return searchMoviesData?.results || [];
    }
    return moviesData?.results || [];
  }, [isSearchMode, searchMoviesData, moviesData]);

  const tvShows = useMemo(() => {
    if (isSearchMode) {
      return searchTVData?.results || [];
    }
    return tvData?.results || [];
  }, [isSearchMode, searchTVData, tvData]);

  const loading = useMemo(() => {
    if (isSearchMode) {
      return searchMoviesLoading || searchTVLoading;
    }
    return moviesLoading || tvLoading;
  }, [
    isSearchMode,
    searchMoviesLoading,
    searchTVLoading,
    moviesLoading,
    tvLoading,
  ]);

  const error = useMemo(() => {
    if (isSearchMode) {
      return searchMoviesError || searchTVError;
    }
    return moviesError || tvError;
  }, [isSearchMode, searchMoviesError, searchTVError, moviesError, tvError]);

  const handleRetry = () => {
    if (isSearchMode) {
      refetchSearchMovies();
      refetchSearchTV();
    } else {
      refetchMovies();
      refetchTV();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
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
              : `Failed to ${isSearchMode ? "search" : "fetch trending"} content`}
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
          {isSearchMode ? (
            <Search className="w-12 h-12 text-base-content/50 mb-4" />
          ) : (
            <TrendingUp className="w-12 h-12 text-base-content/50 mb-4" />
          )}
          <h3 className="text-lg font-semibold mb-2">
            {isSearchMode
              ? "No search results found"
              : "No trending content found"}
          </h3>
          <p className="text-base-content/70 text-center max-w-md">
            {isSearchMode
              ? `No results found for "${debouncedSearchQuery}". Try different keywords.`
              : "Try adjusting your filters or check back later."}
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
                {isSearchMode ? "Movies" : "Trending Movies"}
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
                {isSearchMode ? "Series" : "Trending Series"}
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
            {isSearchMode ? (
              <Search className="w-8 h-8" />
            ) : (
              <TrendingUp className="w-8 h-8" />
            )}
            {isSearchMode ? "Search Results" : "Discover"}
          </h1>
          <p className="text-base-content/70 mt-2">
            {isSearchMode
              ? `Showing results for "${debouncedSearchQuery}"`
              : "Explore trending movies and series"}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <label className="input w-full">
          <Search className="h-[1em] opacity-50" />
          <input
            type="text"
            placeholder="Search for movies and series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50 hover:text-base-content"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </label>
      </div>

      {/* Filters - Only show when not in search mode */}
      {!isSearchMode && (
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
                Series
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Type Filter for Search Mode */}
      {isSearchMode && (
        <div className="flex items-center gap-4 bg-base-200 p-4 rounded-lg">
          <span className="font-medium">Filter Results:</span>
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
              Series
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {renderContent()}
    </div>
  );
}
