import { Suspense } from "react"
import { getFaqCategories } from "@/app/actions/pages/faqActions"
import { FAQSection } from "@/components/faq-section/faq-section"
import Loading from "./loading"
import { FaqProvider } from "@/context/FaqContext"

export const revalidate = 30
export const dynamic = "force-dynamic"

interface FAQsPageProps {
  params: Promise<{
    lang: string
  }>
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
