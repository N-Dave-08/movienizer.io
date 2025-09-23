import { Bookmark, Eye, EyeOff } from "lucide-react";

interface MediaCardButtonsProps {
  displayWatched: boolean;
  displayInWatchlist: boolean;
  isLoading: boolean;
  isWatchedLoading: boolean;
  onToggleWatched: () => void;
  onToggleWatchlist: () => void;
}

export function MediaCardButtons({
  displayWatched,
  displayInWatchlist,
  isLoading,
  isWatchedLoading,
  onToggleWatched,
  onToggleWatchlist,
}: MediaCardButtonsProps) {
  return (
    <div className="flex justify-center gap-3 pt-2">
      <button
        type="button"
        onClick={onToggleWatched}
        disabled={isWatchedLoading || isLoading}
        className={`p-2 rounded-full transition-colors backdrop-blur-sm touch-manipulation ${
          displayWatched
            ? "bg-success/80 hover:bg-success active:bg-success"
            : "bg-white/20 hover:bg-white/40 active:bg-white/60"
        } ${isWatchedLoading || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        title={displayWatched ? "Mark as unwatched" : "Mark as watched"}
        aria-label={displayWatched ? "Mark as unwatched" : "Mark as watched"}
      >
        {displayWatched ? (
          <EyeOff className="w-4 h-4 text-white" />
        ) : (
          <Eye className="w-4 h-4 text-white" />
        )}
      </button>

      <button
        type="button"
        onClick={onToggleWatchlist}
        disabled={isLoading || isWatchedLoading}
        className="p-2 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/60 transition-colors backdrop-blur-sm touch-manipulation"
        title={
          displayInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
        }
        aria-label={
          displayInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
        }
      >
        <Bookmark
          className={`w-4 h-4 transition-colors ${
            displayInWatchlist ? "fill-accent text-accent" : "text-white"
          }`}
        />
      </button>
    </div>
  );
}
