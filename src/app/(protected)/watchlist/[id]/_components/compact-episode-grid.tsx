import type { SimpleEpisode } from "@/lib/types/database";

interface CompactEpisodeGridProps {
  episodes: SimpleEpisode[];
  loadingEpisodes: Set<string>;
  onEpisodeToggle: (
    seasonNumber: number,
    episodeNumber: number,
    watched: boolean,
  ) => void;
}

export function CompactEpisodeGrid({
  episodes,
  loadingEpisodes,
  onEpisodeToggle,
}: CompactEpisodeGridProps) {
  return (
    <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-1 p-2 animate-in fade-in duration-300">
      {episodes.map((episode) => {
        const episodeKey = `${episode.season_number}-${episode.episode_number}`;
        const isLoading = loadingEpisodes.has(episodeKey);

        return (
          <button
            key={episodeKey}
            type="button"
            onClick={() =>
              onEpisodeToggle(
                episode.season_number,
                episode.episode_number,
                !episode.watched,
              )
            }
            disabled={isLoading}
            className={`aspect-square rounded border flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-105 relative ${
              episode.watched
                ? "bg-success text-success-content border-success shadow-sm"
                : "bg-base-300 text-base-content border-base-400 hover:bg-base-200"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            title={episode.name}
          >
            {episode.episode_number}
          </button>
        );
      })}
    </div>
  );
}
