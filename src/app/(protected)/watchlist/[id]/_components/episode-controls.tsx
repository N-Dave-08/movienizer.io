import { CheckCheck, Grid3X3, List, RotateCcw } from "lucide-react";

interface EpisodeControlsProps {
  viewMode: "detailed" | "compact";
  onViewModeChange: (mode: "detailed" | "compact") => void;
  unwatchedCount: number;
  watchedCount: number;
  onMarkAllWatched: (watched: boolean) => void;
  seasonLoading: boolean;
}

export function EpisodeControls({
  viewMode,
  onViewModeChange,
  unwatchedCount,
  watchedCount,
  onMarkAllWatched,
  seasonLoading,
}: EpisodeControlsProps) {
  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-base-content/70">View:</span>
        <div className="join space-x-2">
          <button
            type="button"
            className={`btn btn-sm join-item ${viewMode === "compact" ? "btn-primary" : "btn-outline"}`}
            onClick={() => onViewModeChange("compact")}
          >
            <Grid3X3 className="w-4 h-4" />
            Numbers
          </button>
          <button
            type="button"
            className={`btn btn-sm join-item ${viewMode === "detailed" ? "btn-primary" : "btn-outline"}`}
            onClick={() => onViewModeChange("detailed")}
          >
            <List className="w-4 h-4" />
            Detailed
          </button>
        </div>
      </div>

      {/* Mark All Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => onMarkAllWatched(true)}
          disabled={unwatchedCount === 0 || seasonLoading}
        >
          <CheckCheck className="w-4 h-4" />({unwatchedCount})
        </button>

        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => onMarkAllWatched(false)}
          disabled={watchedCount === 0 || seasonLoading}
        >
          <RotateCcw className="w-4 h-4" />({watchedCount})
        </button>
      </div>
    </div>
  );
}
