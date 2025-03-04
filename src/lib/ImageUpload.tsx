"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export interface ImageUploadProps {
  onUpload: (url: string | null) => void;
  defaultImage?: string;
  value?: string;
}

export function ImageUpload({
  onUpload,
  defaultImage,
  value,
}: ImageUploadProps) {
  const currentImage = value || defaultImage;
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      const file = acceptedFiles[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        const imageUrl = data.url;
        setPreview(imageUrl);
        onUpload(imageUrl);
      } catch (error) {
        console.error("Upload error:", error);
        onUpload(null);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleRemove = async () => {
    if (preview) {
      setUploading(true);
      try {
        const response = await fetch("/api/delete-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: preview }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Delete failed");
        }

        setPreview(null);
        onUpload(null);
      } catch (error) {
        console.error("Delete error:", error);
        toast?.({
          title: "Error",
          description: "Failed to delete image",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: false,
  });

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:bg-gray-50",
          preview && "border-none p-0"
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Uploading...</p>
          </div>
        ) : preview && isValidUrl(preview) ? (
          <div className="relative aspect-video w-full">
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              fill
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
                handleRemove();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Drag &apos;n&apos; drop an image here, or click to select one
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
