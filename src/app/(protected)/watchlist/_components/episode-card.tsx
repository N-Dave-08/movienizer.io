import { Eye, EyeOff, Star } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/tmbd/tmdb";
import type { SimpleEpisode } from "@/lib/types/database";

interface EpisodeCardProps {
  episode: SimpleEpisode;
  tvId: number;
  onEpisodeToggle?: (
    seasonNumber: number,
    episodeNumber: number,
    watched: boolean,
  ) => void;
}

export function EpisodeCard({ episode, onEpisodeToggle }: EpisodeCardProps) {
  const handleToggleWatched = () => {
    const newWatchedState = !episode.watched;

    // Delegate to parent component
    if (onEpisodeToggle) {
      onEpisodeToggle(
        episode.season_number,
        episode.episode_number,
        newWatchedState,
      );
    }
  };

  return (
    <div
      className={`card bg-base-100 shadow-sm border-2 transition-all duration-200 ${
        episode.watched
          ? "border-success bg-success/5"
          : "border-base-300 hover:border-primary/30"
      }`}
    >
      <div className="card-body p-4">
        {/* Episode header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1 line-clamp-2">
              Episode {episode.episode_number}: {episode.name}
            </h4>
            {episode.air_date && (
              <p className="text-xs text-base-content/60">
                {new Date(episode.air_date).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Watch status indicator */}
          <div
            className={`badge badge-sm transition-all duration-200 ${
              episode.watched ? "badge-success" : "badge-ghost"
            }`}
          >
            {episode.watched ? "Watched" : "Unwatched"}
          </div>
        </div>

        {/* Episode image */}
        {episode.still_path && (
          <div className="aspect-video bg-base-300 rounded mb-2 overflow-hidden">
            <Image
              src={getImageUrl(episode.still_path, "w300") || ""}
              alt={episode.name}
              width={300}
              height={169}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Episode overview */}
        {episode.overview && (
          <p className="text-xs text-base-content/80 line-clamp-3 mb-3">
            {episode.overview}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {episode.runtime && (
              <span className="text-xs text-base-content/60">
                {episode.runtime}min
              </span>
            )}
            {episode.vote_average && episode.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">
                  {episode.vote_average.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleWatched}
            className={`btn btn-xs transition-all duration-200 ${
              episode.watched
                ? "btn-success hover:btn-outline"
                : "btn-outline btn-primary"
            }`}
          >
            {episode.watched ? (
              <EyeOff className="w-3 h-3" />
            ) : (
              <Eye className="w-3 h-3" />
            )}
            {episode.watched ? "Unwatch" : "Mark Watched"}
          </button>
        </div>
      </div>
    </div>
  );
}
