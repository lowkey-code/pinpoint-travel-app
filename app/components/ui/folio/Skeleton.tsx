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
    <div className="container max-w-4xl mx-auto p-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>
      <Skeleton className="w-full h-14 mb-8 rounded-xl" />
      <div className="space-y-3">
        <TripCardSkeleton />
        <TripCardSkeleton />
        <TripCardSkeleton />
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
