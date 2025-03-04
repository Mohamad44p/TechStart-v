/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link"
import { AVAILABLE_ICONS } from "@/config/icons"
import type { WorkWithUsListing } from "@/app/actions/pages/work-with-us-actions"
import { deleteWorkWithUsListing } from "@/app/actions/pages/work-with-us-actions"

export const columns: ColumnDef<WorkWithUsListing>[] = [
  {
    accessorKey: "iconName",
    header: "Icon",
    cell: ({ row }) => {
      const iconName = row.getValue("iconName") as string;
      const IconComponent = AVAILABLE_ICONS[iconName];
      if (!IconComponent || typeof IconComponent !== 'function') {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Icon = IconComponent as any;
      return <Icon className="h-5 w-5" />;
    },
  },
  {
    accessorKey: "titleEn",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title (EN)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "titleAr",
    header: "Title (AR)",
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags: string = row.getValue("tags")
      return tags.split(",").join(", ")
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => {
      return new Date(row.getValue("deadline")).toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const listing = row.original;
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);

      return (
        <>
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
                <Link href={`/admin/pages/work-with-us/${listing.id}`} passHref prefetch>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this listing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await deleteWorkWithUsListing(listing.id);
                    setShowDeleteDialog(false);
                    router.refresh();
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
]

