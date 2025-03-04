import { getVideoGalleries } from '@/app/actions/videoAction'
import { columns } from './columns'
import { DataTable } from './data-table'
import { formatDate } from '@/lib/utils'
import { FormattedVideoGallery, VideoGallery } from '@/types/video-gallery'
import { videoGalleryConfig } from './video-gallery-config'

export async function VideoGalleryTable() {
  const galleries: VideoGallery[] = await getVideoGalleries()
  
  const formattedGalleries: FormattedVideoGallery[] = galleries.map(gallery => ({
    ...gallery,
    createdAt: formatDate(gallery.createdAt)
  }))

  return <DataTable 
    columns={columns} 
    data={formattedGalleries} 
    config={videoGalleryConfig}
  />
}

