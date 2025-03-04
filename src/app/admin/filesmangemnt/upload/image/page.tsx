import { SingleItemUpload } from "@/components/admin/FilesMangemnt/SingleItemUpload";

export default function ImageUploadPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <SingleItemUpload type="image" acceptedFileTypes={["image/jpeg", "image/png", "image/gif"]} />
    </div>
  )
}

