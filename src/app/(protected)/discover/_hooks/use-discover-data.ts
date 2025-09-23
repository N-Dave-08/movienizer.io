import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  getTrendingMovies,
  getTrendingTVShows,
  searchMovies,
  searchTVShows,
} from "@/lib/tmbd/tmdb";

type TimeWindow = "day" | "week";
type ContentType = "movies" | "tv" | "all";

interface UseDiscoverDataProps {
  debouncedSearchQuery: string;
  timeWindow: TimeWindow;
  contentType: ContentType;
}

export function useDiscoverData({
  debouncedSearchQuery,
  timeWindow,
  contentType,
}: UseDiscoverDataProps) {
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

  return {
    movies,
    tvShows,
    loading,
    error,
    handleRetry,
    isSearchMode,
  };
}
