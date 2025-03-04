import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FilesList } from "@/components/admin/FilesMangemnt/FilesList"

export default function FilesManagementPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Upload Center</h1>
        <div className="flex space-x-4">
          <Link href="/admin/filesmangemnt/upload/file">
            <Button>Upload File</Button>
          </Link>
          <Link href="/admin/filesmangemnt/upload/image">
            <Button>Upload Image</Button>
          </Link>
          <Link href="/admin/filesmangemnt/upload/video">
            <Button>Upload Video</Button>
          </Link>
        </div>
      </div>

      <FilesList />
    </div>
  )
}

