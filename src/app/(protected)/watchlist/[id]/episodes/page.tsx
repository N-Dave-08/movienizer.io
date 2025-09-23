"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { EpisodeCard } from "@/app/(protected)/watchlist/_components/episode-card";
import { CompactEpisodeGrid } from "@/app/(protected)/watchlist/[id]/_components/compact-episode-grid";
import { EpisodeControls } from "@/app/(protected)/watchlist/[id]/_components/episode-controls";
import { SeasonSelector } from "@/app/(protected)/watchlist/[id]/_components/season-selector";
import { useEpisodeManagement } from "@/app/(protected)/watchlist/[id]/_hooks/use-episode-management";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";
import type { WatchlistItem } from "@/lib/types/database";

export default function EpisodesPage() {
  const params = useParams();
  const { items } = useWatchlistStore();
  const [viewMode, setViewMode] = useState<"detailed" | "compact">("compact");

  // Find the watchlist item
  const watchlistItem = items.find((item) => item.id === params.id) as
    | WatchlistItem
    | undefined;

  // Extract stable values to avoid unnecessary re-renders
  const tmdbId = watchlistItem?.tmdb_id;
  const mediaType = watchlistItem?.media_type;

  // Use the custom hook for episode management
  const {
    selectedSeason,
    setSelectedSeason,
    seasons,
    episodes,
    loading,
    loadingEpisodes,
    seasonLoading,
    handleEpisodeToggle,
    handleMarkAllWatched,
    unwatchedCount,
    watchedCount,
  } = useEpisodeManagement({ tmdbId, mediaType });

  if (!watchlistItem || mediaType !== "tv") {
    return null; // Just return nothing if item not found or not a TV show
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">{watchlistItem.title}</h3>
              <p className="text-sm text-base-content/70">Episode Management</p>
            </div>
            <Link href="/watchlist" className="btn btn-sm btn-circle btn-ghost">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              {/* Season Selector */}
              <SeasonSelector
                seasons={seasons}
                selectedSeason={selectedSeason}
                onSeasonChange={setSelectedSeason}
              />

              {/* Season Actions */}
              {episodes.length > 0 && (
                <EpisodeControls
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  unwatchedCount={unwatchedCount}
                  watchedCount={watchedCount}
                  onMarkAllWatched={handleMarkAllWatched}
                  seasonLoading={seasonLoading}
                />
              )}

              {/* Episodes */}
              <div>
                {viewMode === "compact" ? (
                  <CompactEpisodeGrid
                    episodes={episodes}
                    loadingEpisodes={loadingEpisodes}
                    onEpisodeToggle={handleEpisodeToggle}
                  />
                ) : (
                  <div className="grid gap-3 md:grid-cols-3 animate-in fade-in duration-300">
                    {episodes.map((episode) => (
                      <EpisodeCard
                        key={`${episode.season_number}-${episode.episode_number}`}
                        episode={episode}
                        tvId={tmdbId || 0}
                        onEpisodeToggle={handleEpisodeToggle}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
