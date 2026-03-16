import { Skeleton } from "@/components/ui/skeleton"

/**
 * Generic loading skeleton that mimics real layout shapes.
 * @param {{ variant: "metrics"|"chart"|"table" }} props
 */
export function LoadingSkeleton({ variant = "metrics" }) {
  if (variant === "metrics") {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === "chart") {
    return (
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-[250px] w-full" />
      </div>
    )
  }

  if (variant === "table") {
    return (
      <div className="rounded-lg border bg-card p-6 space-y-3">
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
        <div className="flex justify-between mt-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-48" />
        </div>
      </div>
    )
  }

  return null
}
