import {
  AlertCircle,
  Film,
  RefreshCw,
  Search,
  TrendingUp,
  Tv,
} from "lucide-react";
import { CardSkeletonListGrid } from "@/app/(protected)/_components/card-skeleton-list";
import { MediaCard } from "@/app/(protected)/discover/_components/media-card";
import { MediaCardList } from "@/app/(protected)/discover/_components/media-card-list";
import type { Movie, TVShow } from "@/lib/tmbd/types";

type ContentType = "movies" | "tv" | "all";

interface DiscoverContentProps {
  loading: boolean;
  error: Error | null;
  movies: Movie[];
  tvShows: TVShow[];
  contentType: ContentType;
  viewMode: "grid" | "list";
  isSearchMode: boolean;
  debouncedSearchQuery: string;
  onRetry: () => void;
}

export function DiscoverContent({
  loading,
  error,
  movies,
  tvShows,
  contentType,
  viewMode,
  isSearchMode,
  debouncedSearchQuery,
  onRetry,
}: DiscoverContentProps) {
  if (loading) {
    return (
      <div className="space-y-8">
        {(contentType === "movies" || contentType === "all") && (
          <section>
            <div className="h-8 bg-base-300 rounded w-48 mb-6 animate-pulse"></div>
            <CardSkeletonListGrid count={8} />
          </section>
        )}
        {(contentType === "tv" || contentType === "all") && (
          <section>
            <div className="h-8 bg-base-300 rounded w-48 mb-6 animate-pulse"></div>
            <CardSkeletonListGrid count={8} />
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
        <button type="button" onClick={onRetry} className="btn btn-primary">
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
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <MediaCard key={movie.id} item={movie} type="movie" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {movies.map((movie) => (
                  <MediaCardList key={movie.id} item={movie} type="movie" />
                ))}
              </div>
            )}
          </section>
        )}

      {tvShows.length > 0 &&
        (contentType === "tv" || contentType === "all") && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Tv className="w-6 h-6" />
              {isSearchMode ? "Series" : "Trending Series"}
            </h2>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tvShows.map((tvShow) => (
                  <MediaCard key={tvShow.id} item={tvShow} type="tv" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {tvShows.map((tvShow) => (
                  <MediaCardList key={tvShow.id} item={tvShow} type="tv" />
                ))}
              </div>
            )}
          </section>
        )}
    </div>
  );
}
