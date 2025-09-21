import { Bookmark, Eye, EyeOff } from "lucide-react";

interface MediaCardButtonsListProps {
  displayWatched: boolean;
  displayInWatchlist: boolean;
  isLoading: boolean;
  isWatchedLoading: boolean;
  onToggleWatched: () => void;
  onToggleWatchlist: () => void;
}

export function MediaCardButtonsList({
  displayWatched,
  displayInWatchlist,
  isLoading,
  isWatchedLoading,
  onToggleWatched,
  onToggleWatchlist,
}: MediaCardButtonsListProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggleWatched}
        className={`p-2 rounded-full transition-colors touch-manipulation ${
          displayWatched
            ? "bg-success/80 hover:bg-success active:bg-success"
            : "bg-base-300 hover:bg-base-200 active:bg-base-200"
        } ${isWatchedLoading || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        title={displayWatched ? "Mark as unwatched" : "Mark as watched"}
        aria-label={displayWatched ? "Mark as unwatched" : "Mark as watched"}
        disabled={isWatchedLoading || isLoading}
      >
        {displayWatched ? (
          <EyeOff className="w-4 h-4 text-white" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>

      <button
        type="button"
        onClick={onToggleWatchlist}
        className="p-2 rounded-full bg-base-300 hover:bg-base-200 active:bg-base-200 transition-colors touch-manipulation"
        title={
          displayInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
        }
        aria-label={
          displayInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
        }
        disabled={isLoading || isWatchedLoading}
      >
        <Bookmark
          className={`w-4 h-4 transition-colors ${
            displayInWatchlist ? "fill-accent text-accent" : ""
          }`}
        />
      </button>
    </div>
  );
}
