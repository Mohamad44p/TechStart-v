"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MultiImageUploadProps {
  onUpload: (urls: string[]) => void;
  defaultImages?: string[];
  onDelete?: (index: number) => void;
}

export function MultiImageUpload({
  onUpload,
  defaultImages = [],
  onDelete,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(defaultImages);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      const formData = new FormData();
      acceptedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      try {
        const response = await fetch("/api/upload-multiple", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        const newPreviews = [...previews, ...data.urls];
        setPreviews(newPreviews);
        onUpload(newPreviews);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    },
    [previews, onUpload]
  );

  const handleRemove = async (index: number) => {
    const imageToRemove = previews[index];
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);

    try {
      const response = await fetch("/api/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imageToRemove,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Delete response:", data);
        throw new Error(data.error || "Delete failed");
      }

      onUpload(newPreviews);
      if (onDelete) {
        onDelete(index);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setPreviews(previews); // Restore the previous state
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".webp",
        ".avif",
        ".svg",
        ".bmp",
        ".tiff",
        ".ico",
      ],
    },
    multiple: true,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:bg-gray-50"
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Drag &apos;n&apos; drop images here, or click to select
            </p>
          </div>
        )}
      </div>
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <Image
                src={preview || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                width={200}
                height={200}
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(index);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
