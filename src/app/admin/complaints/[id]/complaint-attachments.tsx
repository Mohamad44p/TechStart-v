import { Card, CardContent } from "@/components/ui/card"
import { formatBytes } from "@/lib/utils"

export function ComplaintAttachments({ 
  attachments 
}: { 
  attachments: Array<{
    id: string
    fileName: string
    fileUrl: string
    fileType: string
    fileSize: number
    uploadedAt: Date
  }>
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {attachments.map((attachment) => (
        <Card key={attachment.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-medium">{attachment.fileName}</p>
                <p className="text-sm text-gray-500">
                  {attachment.fileType} • {formatBytes(attachment.fileSize)}
                </p>
              </div>
              <a
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Download
              </a>
            </div>
          </CardContent>
        </Card>
      ))}

      {attachments.length === 0 && (
        <p className="text-gray-500 col-span-2 text-center py-4">
          No attachments found
        </p>
      )}
    </div>
  )
}
