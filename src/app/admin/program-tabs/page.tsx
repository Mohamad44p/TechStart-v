import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { ProgramTab, ProgramsPages } from "@/types/program-tab"
import db from "@/app/db/db"
import DisplayProgramTabs from "@/components/admin/program-tap/DisplayProgramTabs"

export const dynamic = "force-dynamic"

async function fetchProgramTabs(): Promise<ProgramTab[] | null> {
  try {
    const programTabs = await db.programTab.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        programPage: true,
        buttons: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
    return programTabs
  } catch (error) {
    console.error("Failed to fetch program tabs:", error)
    return null
  }
}

async function fetchPrograms(): Promise<ProgramsPages[] | null> {
  try {
    const programs = await db.programsPages.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return programs
  } catch (error) {
    console.error("Failed to fetch programs:", error)
    return null
  }
}

export default async function ProgramTabsPage() {
  const programTabs = await fetchProgramTabs()
  const programs = await fetchPrograms()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Program Tabs</h1>
      <div className="mb-4">
        <Link href="/admin/program-tabs/create" passHref prefetch>
          <Button>Create New Program Tab</Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {programTabs === null || programs === null ? (
          <div className="text-red-500">Error: Unable to fetch data. Please check your database connection.</div>
        ) : programTabs.length === 0 ? (
          <div>No program tabs found. Create a new one to get started.</div>
        ) : (
          <DisplayProgramTabs initialProgramTabs={programTabs} programs={programs} />
        )}
      </Suspense>
    </div>
  )
}

