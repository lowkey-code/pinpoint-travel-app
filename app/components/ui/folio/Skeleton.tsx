import { cn } from "~/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-paper-line/50 rounded",
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-paper-card border border-paper-line rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

export function DayViewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="text-center">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto mt-1" />
        </div>
        <Skeleton className="w-10 h-10 rounded-lg" />
      </div>
      <div className="flex gap-2 border-b border-paper-line pb-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
      <div className="space-y-4 px-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
