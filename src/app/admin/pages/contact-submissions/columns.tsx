/* eslint-disable react-hooks/rules-of-hooks */
"use client"

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
import { toast } from "@/hooks/use-toast"
import { ContactSubmission, deleteContactSubmission, updateSubmissionStatus } from "@/app/actions/pages/contact-actions"
import { useRouter } from "next/navigation"

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  })
}

export const columns: ColumnDef<ContactSubmission>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message: string = row.getValue("message")
      return <div className="max-w-[300px] truncate">{message.slice(0, 100)}...</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Submitted At",
    cell: ({ row }) => {
      return formatDate(row.getValue("createdAt"))
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status")
      return (
        <span className={`px-2 py-1 rounded-full text-sm ${
          status === 'new' ? 'bg-blue-100 text-blue-800' :
          status === 'read' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const submission = row.original
      const router = useRouter()

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
            <DropdownMenuItem
              onClick={() => {
                router.push(`/admin/pages/contact-submissions/${submission.id}`)
              }}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await updateSubmissionStatus(submission.id, 'read')
                toast({ title: "Marked as read" })
              }}
            >
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await updateSubmissionStatus(submission.id, 'archived')
                toast({ title: "Archived successfully" })
              }}
            >
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await deleteContactSubmission(submission.id)
                toast({ title: "Submission deleted successfully" })
                router.refresh()
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

