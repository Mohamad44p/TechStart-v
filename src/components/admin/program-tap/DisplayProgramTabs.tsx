"use client"

import { useState } from "react"
import type { ProgramTab, ProgramsPages } from "@/types/program-tab"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { deleteProgramTab } from "@/app/actions/program-tab-actions"
import Link from "next/link"

interface DisplayProgramTabsProps {
  initialProgramTabs: ProgramTab[]
  programs: ProgramsPages[]
}

export default function DisplayProgramTabs({ initialProgramTabs }: DisplayProgramTabsProps) {
  const [programTabs, setProgramTabs] = useState(initialProgramTabs)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this program tab?")) {
      const result = await deleteProgramTab(id)
      if (result.success) {
        setProgramTabs(programTabs.filter((tab) => tab.id !== id))
        toast({
          title: "Program tab deleted",
          description: "The program tab has been deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    }
  }

  if (programTabs.length === 0) {
    return <div>No program tabs found. Create a new one to get started.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title (EN)</TableHead>
          <TableHead>Title (AR)</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Program</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programTabs.map((tab) => (
          <TableRow key={tab.id}>
            <TableCell>{tab.title_en}</TableCell>
            <TableCell>{tab.title_ar}</TableCell>
            <TableCell>{tab.slug}</TableCell>
            <TableCell>{tab.programPage?.name_en || "N/A"}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Link href={`/admin/program-tabs/edit/${tab.id}`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <Button variant="destructive" onClick={() => handleDelete(tab.id)}>
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

