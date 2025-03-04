import db from "@/app/db/db"
import ProgramTabForm from "@/components/admin/program-tap/ProgramTabForm"

export default async function EditProgramTabPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [programTab, programs] = await Promise.all([
    db.programTab.findUnique({
      where: { id: params.id },
      include: {
        programPage: true,
        buttons: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    }),
    db.programsPages.findMany(),
  ])

  if (!programTab) {
    return <div>Program tab not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Program Tab</h1>
      <ProgramTabForm 
        programTab={{
          ...programTab,
          buttons: programTab.buttons || [] // Ensure buttons is never undefined
        }} 
        programs={programs} 
      />
    </div>
  )
}

