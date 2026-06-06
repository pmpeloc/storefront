export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-stone-200 rounded ${className}`} />
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden border border-stone-200 bg-white">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-9 w-full mt-2" />
      </div>
    </div>
  )
}
