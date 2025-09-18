"use client";

import { Filter, Popcorn, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { MediaSkeletonGrid } from "@/app/(protected)/discover/_components/media-skeleton";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";
import { WatchlistCard } from "./_components/watchlist-card";

export default function Watchlist() {
  const { user, loading: authLoading } = useAuthStore();
  const { items, loading, error, loadWatchlist, initialized, clearError } =
    useWatchlistStore();
  const [filter, setFilter] = useState<"all" | "watched" | "unwatched">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "movie" | "tv">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load watchlist when component mounts
  useEffect(() => {
    if (user && !initialized) {
      loadWatchlist();
    }
  }, [user, initialized, loadWatchlist]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
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

      {items.length === 0 ? (
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-base-200 p-4 rounded-lg">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="font-medium">Status:</span>
                <div className="join space-x-2">
                  <button
                    type="button"
                    className={`btn join-item btn-sm ${filter === "all" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("all")}
                  >
                    All Items
                  </button>
                  <button
                    type="button"
                    className={`btn join-item btn-sm ${filter === "unwatched" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("unwatched")}
                  >
                    Unwatched
                  </button>
                  <button
                    type="button"
                    className={`btn join-item btn-sm ${filter === "watched" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("watched")}
                  >
                    Watched
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="font-medium">Type:</span>
                <div className="join space-x-2">
                  <button
                    type="button"
                    className={`btn join-item btn-sm ${typeFilter === "all" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setTypeFilter("all")}
                  >
                    All Types
                  </button>
                  <button
                    type="button"
                    className={`btn join-item btn-sm ${typeFilter === "movie" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setTypeFilter("movie")}
                  >
                    Movies
                  </button>
                  <button
                    type="button"
                    className={`btn join-item btn-sm ${typeFilter === "tv" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setTypeFilter("tv")}
                  >
                    Series
                  </button>
                </div>
              </div>
            </div>
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
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 mx-auto text-base-content/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No items match your filters
              </h3>
              <p className="text-base-content/70">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : loading && !initialized ? (
            <MediaSkeletonGrid count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <WatchlistCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
