/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, MessageCircle, CheckCircle } from "lucide-react"
import { ComplaintStatus, Complaint } from "@/types/complaint"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const columns: ColumnDef<Complaint>[] = [
  {
    accessorKey: "complaintNumber",
    header: "Number",
  },
  {
    accessorKey: "submittedAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.getValue("submittedAt")),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={row.getValue("type") === "ANONYMOUS" ? "secondary" : "default"}>
        {row.getValue("type")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ComplaintStatus
      return (
        <Badge variant={
          status === 'PENDING' ? "outline" :
          status === 'IN_REVIEW' ? "secondary" :
          status === 'RESOLVED' ? "default" : "destructive"
        }>
          {status.replace('_', ' ')}
        </Badge>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">{row.getValue("description")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const complaint = row.original
      const router = useRouter()

      const handleMarkResolved = async () => {
        try {
          const response = await fetch(`/api/complaints/${complaint.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'RESOLVED' }),
          })

          if (!response.ok) throw new Error('Failed to update status')
          router.refresh()
        } catch (error) {
          console.error('Error updating status:', error)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link prefetch passHref href={`/admin/complaints/${complaint.id}`}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link prefetch passHref href={`/admin/complaints/${complaint.id}?tab=notes`}>
                <MessageCircle className="mr-2 h-4 w-4" /> Add Note
              </Link>
            </DropdownMenuItem>
            {complaint.status !== 'RESOLVED' && (
              <DropdownMenuItem onClick={handleMarkResolved}>
                <CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
