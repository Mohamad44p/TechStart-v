/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { FormattedVideoGallery } from "@/types/video-gallery"
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { deleteVideoGallery } from "@/app/actions/videoAction"
import { useRouter } from "next/navigation"

export const columns: ColumnDef<FormattedVideoGallery>[] = [
  {
    accessorKey: "title_en",
    header: "Title (English)",
  },
  {
    accessorKey: "title_ar",
    header: "Title (Arabic)",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return <div>{row.getValue("createdAt")}</div>;
    },
  },
  {
    accessorKey: "videos",
    header: "Videos",
    cell: ({ row }) => {
      const videos = row.original.videos
      return (
        <div>
          {videos.length > 0 ? (
            <video
              src={videos[0].url}
              className="w-24 h-16 object-cover rounded"
              controls
            />
          ) : (
            "No videos"
          )}
          <div className="text-sm text-gray-500">{videos.length} video(s)</div>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const gallery = row.original;
      const router = useRouter();
      const { toast } = useToast();

      const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this gallery?")) {
          return;
        }

        try {
          const response = await deleteVideoGallery(gallery.id);
          
          if (response?.success) {
            toast({
              title: "Success",
              description: "Gallery deleted successfully",
            });
            router.refresh();
          } else {
            throw new Error(response?.error || "Failed to delete gallery");
          }
        } catch (error) {
          console.error("Error deleting gallery:", error);
          toast({
            title: "Error",
            description: "Failed to delete gallery",
            variant: "destructive",
          });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/VideoGallery/edit/${gallery.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

