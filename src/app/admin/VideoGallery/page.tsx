import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { VideoGalleryTable } from "@/components/admin/Gallary/tabel/video-gallery-table"

export const dynamic = "force-dynamic"

export default function VideoGallery() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Video Galleries</h1>
        <Link href="/admin/VideoGallery/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Gallery
          </Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="w-full h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      >
        <VideoGalleryTable />
      </Suspense>
    </div>
  )
}

