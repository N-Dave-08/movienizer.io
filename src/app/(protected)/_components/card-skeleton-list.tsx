export function CardSkeletonList() {
  return (
    <div className="flex items-center gap-4 p-4 bg-base-100 shadow-sm rounded-lg border border-base-300">
      {/* Poster thumbnail skeleton */}
      <div className="w-16 h-24 flex-shrink-0 bg-neutral rounded animate-pulse" />

      <div className="flex-1 min-w-0">
        {/* Content skeleton */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* Title skeleton */}
            <div className="h-6 bg-neutral rounded flex-1 animate-pulse" />
            {/* Badge skeleton */}
            <div className="w-16 h-5 bg-neutral rounded-full animate-pulse" />
          </div>

          {/* Metadata skeleton */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-neutral rounded animate-pulse" />
              <div className="w-12 h-4 bg-neutral rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-neutral rounded animate-pulse" />
              <div className="w-20 h-4 bg-neutral rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral rounded animate-pulse" />
          <div className="w-8 h-8 bg-neutral rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeletonListGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <CardSkeletonList key={`card-skeleton-list-${Date.now()}-${index}`} />
      ))}
    </div>
  );
}
