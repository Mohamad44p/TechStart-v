import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4">
        <Skeleton className="h-10 w-96 mx-auto mb-16" />
        
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-72" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
