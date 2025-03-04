import { SingleItemUpload } from "@/components/admin/FilesMangemnt/SingleItemUpload";

export default function VideoUploadPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <SingleItemUpload type="video" acceptedFileTypes={["video/mp4", "video/webm", "video/ogg"]} />
    </div>
  )
}

