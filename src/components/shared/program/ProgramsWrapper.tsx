import { getProgramsWithHero } from "@/app/actions/program-actions"
import ProgramsSec from "./ProgramsSec"
import type { Program } from "@/types/program"

export default async function ProgramsWrapper() {
  const response = await getProgramsWithHero()

  if (!response.success || !response.data) {
    console.error("Failed to fetch programs:", response.error)
    return <div>Error loading programs</div>
  }

  // Define the ordered program IDs
  const orderedProgramIds = [
    'cm7urr4jk001dt718l3o9exad', // UPSkill Program
    'cm7urp3n80015t718sk4lzm6r', // Pioneer
    'cm7urobwh0013t718p2dzugua'  // Horizons
  ]

  const programsById = new Map<string, Program>()
  
  // Map programs by their IDs
  response.data.forEach(program => {
    programsById.set(program.id, {
      id: program.id,
      name_en: program.name_en,
      name_ar: program.name_ar,
      description_en: program.description_en || `Learn more about our program and how it can help you achieve your goals.`,
      description_ar: program.description_ar || `تعرف على المزيد حول البرنامج وكيف يمكنه مساعدتك في تحقيق أهدافك.`,
      imageUrl: program.imageUrl
    })
  })

  // Create the final array in the exact order specified by IDs
  const orderedPrograms: Program[] = []
  for (const id of orderedProgramIds) {
    const program = programsById.get(id)
    if (program) {
      orderedPrograms.push(program)
    }
  }

  return <ProgramsSec programs={orderedPrograms} />
}

