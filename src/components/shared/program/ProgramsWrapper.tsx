import { getProgramsWithHero } from "@/app/actions/program-actions"
import ProgramsSec from "./ProgramsSec"
import type { Program } from "@/types/program"

export default async function ProgramsWrapper() {
  const response = await getProgramsWithHero()

  if (!response.success || !response.data) {
    console.error("Failed to fetch programs:", response.error)
    return <div>Error loading programs</div>
  }


  const orderedProgramNames = ['UPSkill Program', 'Pioneer', 'Horizons']

  const programsByName = new Map<string, Program>()

  response.data.forEach(program => {


    for (const name of orderedProgramNames) {
      if (program.name_en.includes(name) || program.name_ar.includes(name)) {
        // Ensure descriptions are not empty
        const description_en = program.description_en || `Learn more about our ${name} program and how it can help you achieve your goals.`
        const description_ar = program.description_ar || `تعرف على المزيد حول برنامج ${name} وكيف يمكنه مساعدتك في تحقيق أهدافك.`

        programsByName.set(name, {
          id: program.id,
          name_en: program.name_en,
          name_ar: program.name_ar,
          description_en,
          description_ar,
          imageUrl: program.imageUrl
        })
        break
      }
    }
  })

  // Create the final array in the exact order specified
  const orderedPrograms: Program[] = []
  for (const name of orderedProgramNames) {
    const program = programsByName.get(name)
    if (program) {
      orderedPrograms.push(program)
    }
  }

  // Log the final ordered programs to debug

  return <ProgramsSec programs={orderedPrograms} />
}

