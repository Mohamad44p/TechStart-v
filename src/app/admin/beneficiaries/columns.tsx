/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { deleteBeneficiary } from "@/app/actions/beneficiaryActions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Beneficiary {
  id: string
  title_en: string
  title_ar: string
  category: {
    name_en: string
    name_ar: string
  }
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<Beneficiary>[] = [
  {
    accessorKey: "title_en",
    header: "Title (EN)",
  },
  {
    accessorKey: "title_ar",
    header: "Title (AR)",
  },
  {
    accessorKey: "category.name_en",
    header: "Category",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => {
      // Use a consistent date format that doesn't depend on locale
      const date = new Date(getValue() as string);
      // Format: YYYY-MM-DD
      return date.toISOString().split('T')[0];
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toISOString().split('T')[0];
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const beneficiary = row.original
      const { toast } = useToast()
      const router = useRouter()

      const handleDelete = async () => {
        const result = await deleteBeneficiary(beneficiary.id)
        if (result.success) {
          toast({ title: "Success", description: "Beneficiary deleted successfully" })
          router.refresh()
        } else {
          toast({ title: "Error", description: result.error, variant: "destructive" })
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
              <Link prefetch passHref href={`/admin/beneficiaries/${beneficiary.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
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
