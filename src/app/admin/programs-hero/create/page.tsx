import { Suspense } from "react"
import ProgramsHeroForm from "@/components/admin/program-tap/ProgramsHeroForm"
import { Skeleton } from "@/components/ui/skeleton"
import db from "@/app/db/db"

export default async function CreateProgramsHeroPage() {
  const programs = await db.programsPages.findMany()

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">Create Programs Hero</h1>
      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <ProgramsHeroForm programs={programs} />
      </Suspense>
    </div>
  )
}

