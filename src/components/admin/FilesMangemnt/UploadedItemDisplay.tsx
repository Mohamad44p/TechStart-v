"use client"

import { useState } from "react"
import Image from "next/image"
import { FileText, Video, ImageIcon, Copy, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface UploadedItemDisplayProps {
  item: {
    id: string
    name: string
    url: string
    type: "file" | "image" | "video"
    mimeType: string
    size: number
  }
  onDelete: () => void
}

export function UploadedItemDisplay({ item, onDelete }: UploadedItemDisplayProps) {
  const [copying, setCopying] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(item.url)
      setCopying(true)
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard.",
      })
      setTimeout(() => setCopying(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      toast({
        title: "Copy failed",
        description: "Failed to copy the link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/universal-upload/delete/${item.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete item")
      }

      toast({
        title: "Item deleted",
        description: "The item has been successfully deleted.",
      })
      onDelete()
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete the item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const getItemIcon = () => {
    switch (item.type) {
      case "image":
        return <ImageIcon className="h-12 w-12 text-blue-500" />
      case "video":
        return <Video className="h-12 w-12 text-green-500" />
      default:
        return <FileText className="h-12 w-12 text-gray-500" />
    }
  }

  return (
    <div className="border rounded-lg p-4 max-w-md mx-auto">
      <div className="flex items-center mb-4">
        {getItemIcon()}
        <h3 className="ml-2 text-lg font-semibold truncate">{item.name}</h3>
      </div>
      {item.type === "image" && (
        <div className="relative h-48 mb-4">
          <Image src={item.url || "/placeholder.svg"} alt={item.name} fill className="object-contain rounded" />
        </div>
      )}
      {item.type === "video" && (
        <video controls className="w-full mb-4 rounded">
          <source src={item.url} type={item.mimeType} />
          Your browser does not support the video tag.
        </video>
      )}
      <p className="text-sm text-gray-500 mb-2">Size: {(item.size / 1024 / 1024).toFixed(2)} MB</p>
      <div className="flex justify-between items-center">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          View {item.type}
        </a>
        <div className="flex space-x-2">
          <Button onClick={copyToClipboard} disabled={copying}>
            {copying ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copying ? "Copied!" : "Copy Link"}
          </Button>
          <Button onClick={handleDelete} variant="destructive" disabled={deleting}>
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}

