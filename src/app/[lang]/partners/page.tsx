import { getPartnerPages } from "@/app/actions/pages/partner-actions"
import PartnersPageClient from "@/components/shared/Clients/PartnersPage"
import type { PartnerPage } from "@/types/partner"
import { SeoMetadata } from "@/components/shared/SeoMetadata"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

interface PartnersPageProps {
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata(props: PartnersPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang } = params;

  // Default metadata if no custom SEO is set
  return {
    title: lang === 'ar' ? 'شركاؤنا - تيك ستارت' : 'Our Partners - TechStart',
    description: lang === 'ar' 
      ? 'تعرف على شركاء تيك ستارت الذين يساعدوننا في تحقيق مهمتنا لتطوير المهارات التقنية في فلسطين.'
      : 'Learn about TechStart partners who help us achieve our mission of developing technical skills in Palestine.',
  }
}

export default async function PartnersWrapper(props: PartnersPageProps) {
  const params = await props.params;
  const { lang } = params;
  const { data: partnerPages, error } = await getPartnerPages()

  if (error) {
    console.error("Failed to fetch partner pages:", error)
    return <div>Error loading partner pages</div>
  }

  const partners: PartnerPage[] = partnerPages || []

  return (
    <>
      <SeoMetadata 
        path="/partners" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'شركاؤنا - تيك ستارت' : 'Our Partners - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'تعرف على شركاء تيك ستارت الذين يساعدوننا في تحقيق مهمتنا لتطوير المهارات التقنية في فلسطين.'
          : 'Learn about TechStart partners who help us achieve our mission of developing technical skills in Palestine.'
        }
      />
      <PartnersPageClient partners={partners} />
    </>
  )
}

