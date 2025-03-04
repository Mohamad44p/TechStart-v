import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import db from '@/app/db/db'
import { columns } from "./columns"
import { DataTable } from '@/components/admin/Gallary/tabel/data-table'
import { Beneficiary } from "@prisma/client"
import { beneficiariesTableConfig } from './config'

export const dynamic = "force-dynamic"

interface FormattedBeneficiary extends Omit<Beneficiary, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name_en: string;
    name_ar: string;
  };
}

export default async function BeneficiariesPage() {
  const beneficiaries = await db.beneficiary.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedBeneficiaries: FormattedBeneficiary[] = beneficiaries.map(b => ({
    ...b,
    // Format: YYYY-MM-DD
    createdAt: new Date(b.createdAt).toISOString().split('T')[0],
    updatedAt: new Date(b.updatedAt).toISOString().split('T')[0],
  }))

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Beneficiaries Management</h1>
        <Link prefetch passHref href="/admin/beneficiaries/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Beneficiary
          </Button>
        </Link>
      </div>
      <DataTable 
        columns={columns} 
        data={formattedBeneficiaries} 
        config={beneficiariesTableConfig}
      />
    </div>
  )
}
