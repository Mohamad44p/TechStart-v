"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/admin/Gallary/tabel/data-table"
import { columns } from "./columns"
import type { WorkWithUsListing } from "@/app/actions/pages/work-with-us-actions"
import { workWithUsTableConfig } from "./table-config"

interface WorkWithUsClientProps {
  procurementListings: WorkWithUsListing[]
  recruitmentListings: WorkWithUsListing[]
}

export function WorkWithUsClient({ procurementListings, recruitmentListings }: WorkWithUsClientProps) {
  const [activeTab, setActiveTab] = useState<"procurement" | "recruitment">("procurement")

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/pages/work-with-us/create" passHref prefetch>
          <Button>Add New Listing</Button>
        </Link>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "procurement" | "recruitment")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
        </TabsList>
        <TabsContent value="procurement">
           <DataTable 
            columns={columns} 
            data={procurementListings} 
            config={workWithUsTableConfig}
          />
        </TabsContent>
        <TabsContent value="recruitment">
          <DataTable 
            columns={columns} 
            data={recruitmentListings} 
            config={workWithUsTableConfig}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

