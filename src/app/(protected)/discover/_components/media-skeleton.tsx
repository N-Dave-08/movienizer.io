export function MediaSkeleton() {
  return (
    <figure className="w-full aspect-[2/3] bg-neutral rounded-sm animate-pulse" />
  );
}

export function MediaSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <MediaSkeleton key={`skeleton-${Math.random()}-${index}`} />
      ))}
    </div>
  );
}
