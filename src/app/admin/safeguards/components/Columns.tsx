"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteSafeguard } from "@/app/actions/safeguardActions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export type Safeguard = {
  id: string
  domain: string
  title_en: string
  title_ar: string
  tagline_en: string
  tagline_ar: string
  description_en: string
  description_ar: string
  longDescription_en: string | null
  longDescription_ar: string | null
  bgColor: string
  attachmentUrl: string | null
  imageUrl: string | null
  order: number
  createdAt: string | Date
  updatedAt: string | Date
}

const ActionButtons = ({ safeguard }: { safeguard: Safeguard }) => {
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this safeguard?")) {
      return
    }
    
    const result = await deleteSafeguard(safeguard.id)
    if (result.success) {
      toast({
        title: "Success",
        description: "Safeguard deleted successfully",
      })
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/safeguards/${safeguard.id}`} passHref prefetch>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <Button variant="ghost" size="icon" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export const columns: ColumnDef<Safeguard>[] = [
  {
    accessorKey: "order",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Order
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "domain",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Domain
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "title_en",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title (EN)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "title_ar",
    header: "Title (AR)",
  },
  {
    accessorKey: "attachmentUrl",
    header: "Attachment",
    cell: ({ row }) => {
      const attachmentUrl = row.getValue("attachmentUrl") as string | null;
      if (!attachmentUrl) return null;
      
      return (
        <a
          href={attachmentUrl}
          download
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download
        </a>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionButtons safeguard={row.original} />,
  },
]
