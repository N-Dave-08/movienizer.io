"use client";

import { useState } from "react";
import { ContentTypeFilter } from "@/app/(protected)/discover/_components/content-type-filter";
import { DiscoverContent } from "@/app/(protected)/discover/_components/discover-content";
import { DiscoverHeader } from "@/app/(protected)/discover/_components/discover-header";
import { SearchBar } from "@/app/(protected)/discover/_components/search-bar";
import { useDebounce } from "@/app/(protected)/discover/_hooks/use-debounce";
import { useDiscoverData } from "@/app/(protected)/discover/_hooks/use-discover-data";
import type {
  ContentType,
  TimeWindow,
  ViewMode,
} from "@/app/(protected)/discover/_types";
import { Filters } from "@/components/ui/filters";

export default function Discover() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("week");
  const [contentType, setContentType] = useState<ContentType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { movies, tvShows, loading, error, handleRetry, isSearchMode } =
    useDiscoverData({
      debouncedSearchQuery,
      timeWindow,
      contentType,
    });

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <DiscoverHeader
        isSearchMode={isSearchMode}
        debouncedSearchQuery={debouncedSearchQuery}
      />

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={clearSearch}
      />

      {/* Filters - Only show when not in search mode */}
      {!isSearchMode && (
        <Filters
          filterGroups={[
            {
              key: "timeWindow",
              label: "Time Period",
              value: timeWindow,
              onChange: (value) => setTimeWindow(value as TimeWindow),
              options: [
                { value: "day", label: "Today" },
                { value: "week", label: "This Week" },
              ],
            },
            {
              key: "contentType",
              label: "Content",
              value: contentType,
              onChange: (value) => setContentType(value as ContentType),
              options: [
                { value: "all", label: "All" },
                { value: "movies", label: "Movies" },
                { value: "tv", label: "Series" },
              ],
            },
          ]}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}

      {/* View Toggle for search mode */}
      {isSearchMode && (
        <div className="flex justify-end">
          <Filters
            filterGroups={[]}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      )}

      {/* Content Type Filter for Search Mode */}
      {isSearchMode && (
        <ContentTypeFilter
          contentType={contentType}
          onContentTypeChange={setContentType}
        />
      )}

      {/* Content */}
      <DiscoverContent
        loading={loading}
        error={error}
        movies={movies}
        tvShows={tvShows}
        contentType={contentType}
        viewMode={viewMode}
        isSearchMode={isSearchMode}
        debouncedSearchQuery={debouncedSearchQuery}
        onRetry={handleRetry}
      />
    </div>
  );
}
