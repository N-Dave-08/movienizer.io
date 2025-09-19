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
    <div
      className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-200 ${
        displayInWatchlist || displayWatched
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100"
      }`}
    >
      <button
        type="button"
        onClick={onToggleWatched}
        className={`p-2 rounded-full transition-colors backdrop-blur-sm ${
          displayWatched
            ? "bg-success/80 hover:bg-success"
            : "bg-black/20 hover:bg-black/40"
        } ${isWatchedLoading || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        title={displayWatched ? "Mark as unwatched" : "Mark as watched"}
        disabled={isWatchedLoading || isLoading}
      >
        {displayWatched ? (
          <EyeOff className="w-5 h-5 text-white" />
        ) : (
          <Eye className="w-5 h-5 text-white" />
        )}
      </button>

      <button
        type="button"
        onClick={onToggleWatchlist}
        className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors backdrop-blur-sm"
        title={
          displayInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
        }
        disabled={isLoading || isWatchedLoading}
      >
        <Bookmark
          className={`w-5 h-5 transition-colors ${
            displayInWatchlist ? "fill-accent text-accent" : "text-white"
          }`}
        />
      </button>
    </div>
  );
}
