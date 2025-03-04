"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { deleteFooter } from "@/app/actions/pages/footerActions"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "techStartTitle_en",
    header: "Title (EN)",
  },
  {
    accessorKey: "techStartTitle_ar",
    header: "Title (AR)",
  },
  {
    id: "partners",
    header: "Partners Count",
    cell: ({ row }) => row.original.partners.length,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/pages/footer/${row.original.id}/edit`} passHref prefetch>
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                if (confirm("Are you sure you want to delete this footer?")) {
                  await deleteFooter(row.original.id)
                }
              }}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
