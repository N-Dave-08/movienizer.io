"use client";

import { Filter, Popcorn, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { CardSkeletonListGrid } from "@/app/(protected)/_components/card-skeleton-list";
import { Filters } from "@/components/ui/filters";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";

import { WatchlistCard } from "./_components/watchlist-card";
import { WatchlistCardList } from "./_components/watchlist-card-list";

export default function Watchlist() {
  const { user, loading: authLoading } = useAuthStore();
  const { items, loading, error, clearError } = useWatchlistStore();
  const [filter, setFilter] = useState<"all" | "watched" | "unwatched">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "movie" | "tv">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Clear error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  if (authLoading) {
    return (
      <>
        <div className="mb-8">
          <div className="skeleton h-8 w-48 mb-2"></div>
          <div className="skeleton h-4 w-96"></div>
        </div>

        {/* Skeleton Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-base-200 p-4 rounded-lg">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="skeleton h-4 w-12"></div>
              <div className="flex gap-2">
                <div className="skeleton h-8 w-20"></div>
                <div className="skeleton h-8 w-20"></div>
                <div className="skeleton h-8 w-16"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="skeleton h-4 w-8"></div>
              <div className="flex gap-2">
                <div className="skeleton h-8 w-20"></div>
                <div className="skeleton h-8 w-16"></div>
                <div className="skeleton h-8 w-14"></div>
              </div>
            </div>
          </div>
          <div className="skeleton h-12 w-full rounded-lg"></div>
        </div>

        {/* Skeleton Grid */}
        <CardSkeletonListGrid count={4} />
      </>
    );
  }

  if (!user) {
    redirect("/login");
  }

  // Filter items based on current filters
  const filteredItems = items.filter((item) => {
    const matchesWatchedFilter =
      filter === "all" ||
      (filter === "watched" && item.watched) ||
      (filter === "unwatched" && !item.watched);

    const matchesTypeFilter =
      typeFilter === "all" || item.media_type === typeFilter;

    const matchesSearchQuery =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesWatchedFilter && matchesTypeFilter && matchesSearchQuery;
  });

  // Get display name from user metadata or fallback to email
  const getDisplayName = () => {
    const username = user.user_metadata?.username;
    const displayName = user.user_metadata?.display_name;

    if (username) return `@${username}`;
    if (displayName) return displayName;
    return user.email || "";
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Your Watchlist</h1>
        <p className="text-base-content/70">
          Hello {getDisplayName()}! You have {items.length} item
          {items.length !== 1 ? "s" : ""} in your watchlist.
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="btn btn-sm btn-ghost"
          >
            Dismiss
          </button>
        </div>
      )}

      {items.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center border-2 border-dashed border-base-300 rounded-lg p-8">
          <div className="max-w-md">
            <div className="mb-6">
              <Popcorn className="size-16 mx-auto text-base-content/50" />
            </div>

            <h2 className="text-xl font-bold text-base-content mb-3">
              Start Your Movie Collection
            </h2>

            <p className="text-base-content/70 mb-8 text-sm">
              You haven't added any movies or series to your watchlist yet.
              Discover trending content and start building your collection!
            </p>

            <Link href="/discover">
              <button type="button" className="btn btn-primary">
                Discover Movies & Series
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Filters and Search */}
          <div className="mb-6 space-y-4">
            {/* Filters */}
            <Filters
              filterGroups={[
                {
                  key: "status",
                  label: "Status",
                  value: filter,
                  onChange: (value) =>
                    setFilter(value as "all" | "watched" | "unwatched"),
                  options: [
                    { value: "all", label: "All Items" },
                    { value: "unwatched", label: "Unwatched" },
                    { value: "watched", label: "Watched" },
                  ],
                },
                {
                  key: "type",
                  label: "Type",
                  value: typeFilter,
                  onChange: (value) =>
                    setTypeFilter(value as "all" | "movie" | "tv"),
                  options: [
                    { value: "all", label: "All Types" },
                    { value: "movie", label: "Movies" },
                    { value: "tv", label: "Series" },
                  ],
                },
              ]}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
            {/* Search */}
            <div className="form-control">
              <label className="input">
                <Search className="h-[1em] opacity-50" />
                <input
                  type="text"
                  placeholder="Search your watchlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <CardSkeletonListGrid count={4} />
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 mx-auto text-base-content/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No items match your filters
              </h3>
              <p className="text-base-content/70">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <WatchlistCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <WatchlistCardList key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
