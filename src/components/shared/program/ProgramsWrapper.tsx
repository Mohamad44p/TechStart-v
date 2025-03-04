import { getProgramsWithHero } from "@/app/actions/program-actions"
import ProgramsSec from "./ProgramsSec"
import type { Program } from "@/types/program"

export default async function ProgramsWrapper() {
  const response = await getProgramsWithHero()

  if (!response.success || !response.data) {
    console.error("Failed to fetch programs:", response.error)
    return <div>Error loading programs</div>
  }

  // Define the exact order of programs
  const orderedProgramNames = ['UpSkill', 'Pioneer', 'Horizons']
  
  // Create a map to store programs by name for easy lookup
  const programsByName = new Map<string, Program>()
  
  // Filter and store programs by name
  response.data.forEach(program => {
    for (const name of orderedProgramNames) {
      if (program.name_en.includes(name) || program.name_ar.includes(name)) {
        programsByName.set(name, {
          id: program.id,
          name_en: program.name_en,
          name_ar: program.name_ar,
          description_en: program.description_en,
          description_ar: program.description_ar,
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

  return <ProgramsSec programs={orderedPrograms} />
}

