import type { SimpleSeason } from "@/lib/types/database";

interface SeasonSelectorProps {
  seasons: SimpleSeason[];
  selectedSeason: number;
  onSeasonChange: (season: number) => void;
}

export function SeasonSelector({
  seasons,
  selectedSeason,
  onSeasonChange,
}: SeasonSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
      {seasons.map((season) => (
        <button
          key={season.season_number}
          type="button"
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
            selectedSeason === season.season_number
              ? "bg-primary text-primary-content shadow-md"
              : "bg-base-200 text-base-content hover:bg-base-300 hover:shadow-sm"
          }`}
          onClick={() => onSeasonChange(season.season_number)}
        >
          Season {season.season_number}
          <span className="ml-1 text-xs opacity-70">
            ({season.episode_count})
          </span>
        </button>
      ))}
    </div>
  );
}
