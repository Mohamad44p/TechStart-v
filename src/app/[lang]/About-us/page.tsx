import { getAboutUs } from "@/app/actions/pages/about-us-actions"
import { getFocusareas } from "@/app/actions/pages/focusareas-actions"
import { getAllTeamMembers } from "@/app/actions/pages/team-actions"
import AboutUsContent from "@/components/who-we-are/about-us-content"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const aboutUsData = await getAboutUs()
  const focusareasData = await getFocusareas()
  const teamMembersData = await getAllTeamMembers()

  if (!aboutUsData || !focusareasData || !teamMembersData) {
    return <div>Error loading data</div>
  }

  const transformedAboutUs = {
    ...aboutUsData,
    cards: aboutUsData.cards.map(card => ({
      titleEn: card.titleEn || "",
      titleAr: card.titleAr || "",
      descriptionEn: card.descriptionEn || "",
      descriptionAr: card.descriptionAr || "",
      icon: card.icon || ""
    }))
  }

  return <AboutUsContent aboutUsData={transformedAboutUs} focusareasData={focusareasData} teamMembersData={teamMembersData} />
}

