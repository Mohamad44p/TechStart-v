import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import db from '@/app/db/db'
import { columns, type Safeguard } from "./components/Columns"
import { DataTable } from "./components/DataTable"

export default async function SafeguardsPage() {
  try {
    const safeguards = await db.safeguard.findMany({
    orderBy: [
      { order: 'asc' },
      { domain: 'asc' }
    ],
    select: {
      id: true,
      domain: true,
      title_en: true,
      title_ar: true,
      tagline_en: true,
      tagline_ar: true,
      description_en: true,
      description_ar: true,
      longDescription_en: true,
      longDescription_ar: true,
      bgColor: true,
      attachmentUrl: true,
      imageUrl: true,
      order: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  const formattedSafeguards = safeguards.map((s: Safeguard) => ({
    ...s,
    createdAt: new Date(s.createdAt).toISOString().split('T')[0],
    updatedAt: new Date(s.updatedAt).toISOString().split('T')[0],
  }))

    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Safeguards Management</h1>
          <Link href="/admin/safeguards/create" passHref prefetch>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Safeguard
            </Button>
          </Link>
        </div>
        <DataTable columns={columns} data={formattedSafeguards} />
      </div>
    )
  } catch (error) {
    console.error('Error loading safeguards:', error)
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Safeguards</h1>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    )
  }
}
