import type { EpisodeProgress } from "@/lib/types/database";

interface ProgressIndicatorProps {
  progress: EpisodeProgress;
  compact?: boolean;
  className?: string;
}

export function ProgressIndicator({
  progress,
  compact = false,
  className = "",
}: ProgressIndicatorProps) {
  const { watchedEpisodes, totalEpisodes, progressPercentage } = progress;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex-1 bg-white/20 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-xs text-white font-medium">
          {watchedEpisodes}/{totalEpisodes}
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Progress</span>
        <span className="text-base-content/70">
          {watchedEpisodes}/{totalEpisodes} episodes
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-base-300 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-sm font-medium min-w-0">
          {progressPercentage}%
        </span>
      </div>

      {progressPercentage === 100 && (
        <div className="text-xs text-success font-medium">✓ Completed</div>
      )}
    </div>
  );
}
