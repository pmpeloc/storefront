interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-[10px] ${className}`}
      style={style}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-[14px] overflow-hidden bg-white" style={{ boxShadow: 'var(--sh-card)' }}>
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-28 rounded-full" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Skeleton className="aspect-square w-full rounded-[18px]" />
      <div className="space-y-4">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-4 w-2/5 rounded-full" />
        <Skeleton className="h-24 w-full rounded-[14px]" />
        <Skeleton className="h-12 w-full rounded-[10px]" />
      </div>
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-3 py-4 border-b" style={{ borderColor: 'var(--line-soft)' }}>
      <Skeleton className="w-[74px] h-[74px] rounded-[12px] flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/3 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-[9px]" />
      </div>
    </div>
  )
}
