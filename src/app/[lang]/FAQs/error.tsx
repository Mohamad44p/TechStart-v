'use client'

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-semibold">Something went wrong!</h2>
        <p className="text-gray-600">{error.message}</p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  )
}
