import { Suspense } from 'react'
import { getBeneficiaries, getCategories } from '@/app/actions/beneficiaryActions'
import { BeneficiariesSection } from '@/components/beneficiary/beneficiaries-section'
import Loading from './loading'
import { SeoMetadata } from "@/components/shared/SeoMetadata"
import { Metadata } from "next"

export const revalidate = 30
export const dynamic = "force-dynamic"

interface PalestinianITleadsProps {
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata(props: PalestinianITleadsProps): Promise<Metadata> {
  const params = await props.params;
  const { lang } = params;

  // Default metadata if no custom SEO is set
  return {
    title: lang === 'ar' ? 'قادة تكنولوجيا المعلومات الفلسطينيون - تيك ستارت' : 'Palestinian IT Leads - TechStart',
    description: lang === 'ar' 
      ? 'تعرف على قادة تكنولوجيا المعلومات الفلسطينيين الذين يقودون التحول الرقمي في فلسطين.'
      : 'Learn about Palestinian IT leaders who are driving digital transformation in Palestine.',
  }
}

export default async function PalestinianITleads(props: PalestinianITleadsProps) {
  const params = await props.params;
  const { lang } = params;
  const [beneficiariesResponse, categoriesResponse] = await Promise.all([
    getBeneficiaries(),
    getCategories(),
  ])

  if (!beneficiariesResponse.success || !categoriesResponse.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          {beneficiariesResponse.error || categoriesResponse.error || 'Something went wrong'}
        </p>
      </div>
    )
  }

  return (
    <>
      <SeoMetadata 
        path="/Palestinian-IT-leads" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'قادة تكنولوجيا المعلومات الفلسطينيون - تيك ستارت' : 'Palestinian IT Leads - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'تعرف على قادة تكنولوجيا المعلومات الفلسطينيين الذين يقودون التحول الرقمي في فلسطين.'
          : 'Learn about Palestinian IT leaders who are driving digital transformation in Palestine.'
        }
      />
      <Suspense fallback={<Loading />}>
        <BeneficiariesSection 
          beneficiaries={beneficiariesResponse.data || []}
          categories={categoriesResponse.data || []}
        />
      </Suspense>
    </>
  )
}
