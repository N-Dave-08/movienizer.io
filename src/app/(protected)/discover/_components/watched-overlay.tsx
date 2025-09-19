interface WatchedOverlayProps {
  isWatched: boolean;
}

export function WatchedOverlay({ isWatched }: WatchedOverlayProps) {
  if (!isWatched) return null;

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-sm">
      <div className="bg-success text-success-content px-3 py-1 rounded-full text-sm font-medium">
        Watched
      </div>
    </div>
  );
}
