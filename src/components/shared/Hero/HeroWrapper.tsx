import { getHeroSteps } from "@/app/actions/pages/hero"
import Hero from "./Hero"

export default async function HeroWrapper() {
  const response = await getHeroSteps()

  if (!response.success) {
    console.error("Failed to fetch hero steps:", response.error)
    return <div>Error loading hero content</div>
  }

  // Check if there are any hero steps
  if (response.data.length === 0) {
    return <div>No hero content available</div>
  }

  // Create a map to track used orders and ensure uniqueness
  const usedOrders = new Set()
  
  const steps = response.data.reduce(
    (acc, step) => {
      // Ensure each step has a unique order
      let order = step.order
      
      // If this order is already used, find the next available order
      while (usedOrders.has(order)) {
        order++
      }
      
      // Mark this order as used
      usedOrders.add(order)
      
      acc[order] = {
        title_en: step.title_en,
        title_ar: step.title_ar,
        tagline_en: step.tagline_en,
        tagline_ar: step.tagline_ar,
        description_en: step.description_en,
        description_ar: step.description_ar,
        button_title_en: step.button_title_en || "Get Started Now",
        button_title_ar: step.button_title_ar || "ابدأ الآن",
        button_link: step.button_link || "#",
        color: step.color,
        imageUrl: step.imageUrl,
      }
      return acc
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as Record<number, any>,
  )

  // Ensure there's at least one step with index 0
  if (!steps[0] && Object.keys(steps).length > 0) {
    // Use the first available step as step 0
    const firstKey = Math.min(...Object.keys(steps).map(Number))
    steps[0] = steps[firstKey]
    
    // Remove the duplicate if it's not at index 0
    if (firstKey !== 0) {
      delete steps[firstKey]
    }
  }

  return <Hero steps={steps} />
}

