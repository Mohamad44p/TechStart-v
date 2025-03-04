import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-[90vh] bg-white text-gray-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-10 w-72 mx-auto" />
          </div>
          <div className="flex justify-center gap-3 mb-12">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32" />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
