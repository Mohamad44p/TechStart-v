import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { columns } from "./components/columns"
import { footerTableConfig } from "./config"
import db from '@/app/db/db'
import { DataTable } from '@/components/admin/Gallary/tabel/data-table'

export default async function AdminFooterPage() {
  const footers = await db.footer.findMany({
    include: {
      partners: true,
    },
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Footer Management</h1>
        <Link href="/admin/pages/footer/create" passHref prefetch>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Footer
          </Button>
        </Link>
      </div>
      <DataTable 
        columns={columns} 
        data={footers} 
        config={footerTableConfig}
      />
    </div>
  )
}
