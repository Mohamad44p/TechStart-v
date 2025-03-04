"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { UploadedItemDisplay } from "./UploadedItemDisplay"

interface SingleItemUploadProps {
  type: "file" | "image" | "video"
  acceptedFileTypes: string[]
}

export function SingleItemUpload({ type, acceptedFileTypes }: SingleItemUploadProps) {
  const [uploading, setUploading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [uploadedItem, setUploadedItem] = useState<any>(null)
  const [customName, setCustomName] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!selectedFile || !customName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a name and a file",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("type", type)
    formData.append("customName", customName.trim())

    try {
      const response = await fetch("/api/universal-upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setUploadedItem(data)
      toast({
        title: "Upload Successful",
        description: `Your ${type} has been uploaded successfully.`,
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: `There was an error uploading your ${type}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setSelectedFile(null)
      setCustomName("")
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    setSelectedFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxFiles: 1,
    multiple: false,
  })

  const handleDelete = () => {
    setUploadedItem(null)
  }

  if (uploadedItem) {
    return <UploadedItemDisplay item={uploadedItem} onDelete={handleDelete} />
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customName">Name</Label>
        <Input
          id="customName"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder={`Enter ${type} name`}
        />
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-semibold mb-2">
            {selectedFile ? selectedFile.name : `Drag & drop your ${type} here`}
          </p>
          <p className="text-sm text-gray-500 mb-4">or click to select a {type}</p>
          <Button type="button">Select {type}</Button>
        </div>
      </div>

      <Button 
        onClick={handleUpload} 
        disabled={!selectedFile || !customName || uploading}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload'
        )}
      </Button>
    </div>
  )
}

