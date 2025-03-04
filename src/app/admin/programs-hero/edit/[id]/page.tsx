import db from "@/app/db/db"
import ProgramsHeroForm from "@/components/admin/program-tap/ProgramsHeroForm"

export default async function EditProgramsHeroPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [programsHero, programs] = await Promise.all([
    db.programsHero.findUnique({
      where: { id: params.id },
      include: { programPage: true },
    }),
    db.programsPages.findMany(),
  ])

  if (!programsHero) {
    return <div>Programs hero not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Programs Hero</h1>
      <ProgramsHeroForm programsHero={programsHero} programs={programs} />
    </div>
  )
}

