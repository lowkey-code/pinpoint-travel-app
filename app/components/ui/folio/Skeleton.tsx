import { cn } from "~/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shimmer bg-paper-line/50 rounded",
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
    <div className="space-y-4 pb-24 px-4">
      {/* GateHeader skeleton */}
      <div className="bg-paper-card border border-paper-line rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <Skeleton className="w-16 h-16 rounded-lg" />
          </div>
          <div className="h-12 w-px bg-paper-line" />
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      {/* SegmentTabs skeleton */}
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>

      {/* Cards skeleton */}
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}

export function TripCardSkeleton() {
  return (
    <div className="bg-paper-card border border-paper-line rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex gap-1">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function TripListSkeleton() {
  return (
    <div className="max-w-md mx-auto pb-24">
      <div className="p-4 space-y-6">
        {/* Header skeleton */}
        <header className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div>
              <Skeleton className="h-5 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="w-10 h-10 rounded-xl" />
          </div>
        </header>

        {/* DepartureBoard skeleton */}
        <div className="bg-ink-primary rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="h-8 w-48 bg-paper-line/20" />
            <Skeleton className="h-6 w-16 rounded-full bg-paper-line/20" />
          </div>
          <Skeleton className="h-4 w-64 mb-6 bg-paper-line/20" />
          <div className="flex items-end justify-between">
            <Skeleton className="h-20 w-24 bg-paper-line/20" />
            <Skeleton className="h-10 w-32 rounded-xl bg-paper-line/20" />
          </div>
        </div>

        {/* TicketStub skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-32" />
          <div className="bg-paper-card border border-paper-line rounded-xl p-3 flex gap-3">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Create button skeleton */}
        <Skeleton className="h-20 w-full rounded-xl border-2 border-dashed border-paper-line" />
      </div>
    </div>
  )
}

function GridColumnSkeleton() {
  return (
    <div className="min-w-[280px] flex-1 space-y-3">
      <Skeleton className="h-8 w-full rounded-lg" />
      <div className="space-y-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}

export function GridViewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-paper-line pb-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        <GridColumnSkeleton />
        <GridColumnSkeleton />
        <GridColumnSkeleton />
      </div>
    </div>
  )
}
