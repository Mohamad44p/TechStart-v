import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingFaqPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((j) => (
                  <div key={j} className="border-t pt-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="h-4 w-96" />
                      </div>
                      <div className="text-right space-y-2">
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="h-4 w-96" />
                      </div>
                    </div>
                  </div>
                ))}
                <Skeleton className="h-9 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}