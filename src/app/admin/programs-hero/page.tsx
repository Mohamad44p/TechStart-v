import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { ProgramsHeroWithProgram, ProgramsPages } from "@/types/programs-hero"
import db from "@/app/db/db"
import ProgramsHeroList from "@/components/admin/program-tap/ProgramsHeroList"

export const dynamic = "force-dynamic"

async function fetchProgramsHeroes(): Promise<ProgramsHeroWithProgram[] | null> {
  try {
    const programsHeroes = await db.programsHero.findMany({
      include: { programPage: true },
    }) as ProgramsHeroWithProgram[]
    return programsHeroes
  } catch (error) {
    console.error("Failed to fetch programs heroes:", error)
    return null
  }
}

async function fetchPrograms(): Promise<ProgramsPages[] | null> {
  try {
    const programs = await db.programsPages.findMany()
    return programs
  } catch (error) {
    console.error("Failed to fetch programs:", error)
    return null
  }
}

export default async function ProgramsHeroPage() {
  const programsHeroes = await fetchProgramsHeroes()
  const programs = await fetchPrograms()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Programs Heroes</h1>
      <div className="mb-4">
        <Link href="/admin/programs-hero/create" passHref prefetch>
          <Button>Create New Programs Hero</Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {programsHeroes === null || programs === null ? (
          <div className="text-red-500">Error: Unable to fetch data. Please check your database connection.</div>
        ) : (
          <ProgramsHeroList initialProgramsHeroes={programsHeroes} />
        )}
      </Suspense>
    </div>
  )
}

