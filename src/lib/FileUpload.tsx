"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type React from "react";

interface FileUploadProps {
  onUpload: (urls: string[]) => void;
  defaultFiles?: string[];
  maxFiles?: number;
  acceptedFileTypes?: Record<string, string[]>; // Add this prop
}

const allowedFileTypes = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "text/plain": [".txt"],
  "application/zip": [".zip"],
  "application/x-rar-compressed": [".rar"],
};

export function FileUpload({
  onUpload,
  defaultFiles = [],
  maxFiles = 3,
  acceptedFileTypes = allowedFileTypes, // Use provided types or default
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<string[]>(defaultFiles);
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      try {
        const uploadedUrls: string[] = [];

        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload-file", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();
          uploadedUrls.push(data.url);
        }

        const newFiles = [...files, ...uploadedUrls];
        setFiles(newFiles);
        onUpload(newFiles);

        toast({
          title: "Files uploaded",
          description: "Your files have been successfully uploaded.",
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload failed",
          description:
            "There was an error uploading your files. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [files, onUpload, toast]
  );

  const handleRemove = async (e: React.MouseEvent, fileUrl: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const newFiles = files.filter((f) => f !== fileUrl);
      setFiles(newFiles);
      onUpload(newFiles);

      const response = await fetch(
        `/api/delete-file?fileUrl=${encodeURIComponent(fileUrl)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFiles(files);
        onUpload(files);
        throw new Error(data.error || "Delete failed");
      }

      toast({
        title: "File deleted",
        description: "The file has been successfully deleted.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (fileUrl: string) => {
    const fileName = fileUrl.split("/").pop();
    if (!fileName) return;

    try {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(fileUrl)}`
      );
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description:
          "There was an error downloading your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles || uploading,
  });

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:bg-gray-50",
          (files.length >= maxFiles || uploading) &&
            "opacity-50 cursor-not-allowed"
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
              Drag &apos;n&apos; drop files here, or click to select
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Max {maxFiles} files (PDF, DOC, DOCX, XLS, XLSX, etc.)
            </p>
          </div>
        )}
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative border rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600 truncate">
                  {file.split("/").pop()}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1 right-8"
                onClick={() => handleDownload(file)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1"
                onClick={(e) => handleRemove(e, file)}
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
