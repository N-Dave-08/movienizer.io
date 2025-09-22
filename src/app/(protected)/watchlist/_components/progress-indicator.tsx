import type { EpisodeProgress } from "@/lib/types/database";

interface ProgressIndicatorProps {
  progress: EpisodeProgress;
  compact?: boolean;
  className?: string;
  isLoading?: boolean;
}

export function ProgressIndicator({
  progress,
  compact = false,
  className = "",
  isLoading = false,
}: ProgressIndicatorProps) {
  const { watchedEpisodes, totalEpisodes } = progress;
  const progressPercentage =
    totalEpisodes > 0 ? Math.round((watchedEpisodes / totalEpisodes) * 100) : 0;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex-1 bg-white/20 rounded-full h-1.5">
          <div
            className={`bg-primary h-1.5 rounded-full transition-all duration-300 ${
              isLoading ? "animate-pulse" : ""
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span
          className={`text-xs text-white font-medium ${
            isLoading ? "animate-pulse" : ""
          }`}
        >
          {isLoading ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            `${watchedEpisodes}/${totalEpisodes}`
          )}
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Progress</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-base-300 rounded-full h-2">
          <div
            className={`bg-primary h-2 rounded-full transition-all duration-300 ${
              isLoading ? "animate-pulse" : ""
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span
          className={`text-sm font-medium min-w-0 ${
            isLoading ? "animate-pulse" : ""
          }`}
        >
          {isLoading ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            `${watchedEpisodes}/${totalEpisodes}`
          )}
        </span>
      </div>

      {progressPercentage === 100 && !isLoading && (
        <div className="text-xs text-success font-medium">✓ Completed</div>
      )}
    </div>
  );
}
