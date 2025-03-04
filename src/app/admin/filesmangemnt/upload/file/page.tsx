import { SingleItemUpload } from "@/components/admin/FilesMangemnt/SingleItemUpload";

export default function FileUploadPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload File</h1>
      <SingleItemUpload
        type="file"
        acceptedFileTypes={[
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/plain",
        ]}
      />
    </div>
  )
}

