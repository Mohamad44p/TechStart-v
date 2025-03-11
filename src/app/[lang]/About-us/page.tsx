import { getAboutUs } from "@/app/actions/pages/about-us-actions"
import { getFocusareas } from "@/app/actions/pages/focusareas-actions"
import { getAllTeamMembers } from "@/app/actions/pages/team-actions"
import AboutUsContent from "@/components/who-we-are/about-us-content"
import { SeoMetadata } from "@/components/shared/SeoMetadata"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

interface AboutPageProps {
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata(props: AboutPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang } = params;

  // Default metadata if no custom SEO is set
  return {
    title: lang === 'ar' ? 'من نحن - تيك ستارت' : 'About Us - TechStart',
    description: lang === 'ar' 
      ? 'تعرف على تيك ستارت، مهمتنا، رؤيتنا، وفريقنا. نحن نعمل على تطوير المهارات التقنية في فلسطين.'
      : 'Learn about TechStart, our mission, vision, and team. We are working to develop technical skills in Palestine.',
  }
}

export default async function AboutPage(props: AboutPageProps) {
  const params = await props.params;
  const { lang } = params;
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

  return (
    <>
      <SeoMetadata 
        path="/About-us" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'من نحن - تيك ستارت' : 'About Us - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'تعرف على تيك ستارت، مهمتنا، رؤيتنا، وفريقنا. نحن نعمل على تطوير المهارات التقنية في فلسطين.'
          : 'Learn about TechStart, our mission, vision, and team. We are working to develop technical skills in Palestine.'
        }
      />
      <AboutUsContent aboutUsData={transformedAboutUs} focusareasData={focusareasData} teamMembersData={teamMembersData} />
    </>
  )
}

