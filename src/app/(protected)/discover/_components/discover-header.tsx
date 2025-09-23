import { Search, TrendingUp } from "lucide-react";

interface DiscoverHeaderProps {
  isSearchMode: boolean;
  debouncedSearchQuery: string;
}

export function DiscoverHeader({
  isSearchMode,
  debouncedSearchQuery,
}: DiscoverHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          {isSearchMode ? (
            <Search className="w-8 h-8 md:block hidden" />
          ) : (
            <TrendingUp className="w-8 h-8 md:block hidden" />
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
  );
}
