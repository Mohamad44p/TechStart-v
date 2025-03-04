import db from "@/app/db/db"
import ProgramTabForm from "@/components/admin/program-tap/ProgramTabForm"

export default async function CreateProgramTabPage() {
  const programs = await db.programsPages.findMany()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Program Tab</h1>
      <ProgramTabForm programs={programs} />
    </div>
  )
}

