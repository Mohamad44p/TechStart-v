import { Suspense } from "react"
import { getFaqCategories } from "@/app/actions/pages/faqActions"
import { FAQSection } from "@/components/faq-section/faq-section"
import Loading from "./loading"
import { FaqProvider } from "@/context/FaqContext"
import { SeoMetadata } from "@/components/shared/SeoMetadata"
import { Metadata } from "next"

export const revalidate = 30
export const dynamic = "force-dynamic"

interface FAQsPageProps {
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata(props: FAQsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang } = params;

  return {
    title: lang === 'ar' ? 'الأسئلة الشائعة - تيك ستارت' : 'FAQs - TechStart',
    description: lang === 'ar' 
      ? 'الأسئلة المتداولة حول برامج ومبادرات تيك ستارت. احصل على إجابات لأكثر الأسئلة شيوعًا.'
      : 'Frequently asked questions about TechStart programs and initiatives. Get answers to the most common questions.',
  }
}

export default async function FAQsPage(props: FAQsPageProps) {
  const params = await props.params;
  const {
    lang
  } = params;

  const categories = await getFaqCategories()

  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <p className="text-gray-500">
          {lang === "ar" ? "لا توجد أسئلة متكررة متاحة حالياً" : "No FAQs available at the moment"}
        </p>
      </div>
    )
  }

  const faqsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = category.faqs.map(faq => ({
      ...faq,
      category: category 
    }))
    return acc
  }, {} as Record<string, typeof categories[0]['faqs']>)

  return (
    <div className="min-h-screen">
      <SeoMetadata 
        path="/FAQs" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'الأسئلة الشائعة - تيك ستارت' : 'FAQs - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'الأسئلة المتداولة حول برامج ومبادرات تيك ستارت. احصل على إجابات لأكثر الأسئلة شيوعًا.'
          : 'Frequently asked questions about TechStart programs and initiatives. Get answers to the most common questions.'
        }
      />
      <Suspense fallback={<Loading />}>
        <FaqProvider>
          <FAQSection 
            categories={categories} 
            faqsByCategory={faqsByCategory}
          />
        </FaqProvider>
      </Suspense>
    </div>
  )
}

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }]
}
