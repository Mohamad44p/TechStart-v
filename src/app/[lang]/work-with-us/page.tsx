import { getWorkWithUsListings } from '@/app/actions/pages/work-with-us-actions'
import { WorkWithUs } from '@/components/who-we-are/work-with-us'
import React from 'react'
import { SeoMetadata } from "@/components/shared/SeoMetadata"
import { Metadata } from "next"

export const dynamic = "force-dynamic";

interface WorkWithUsPageProps {
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata(props: WorkWithUsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang } = params;

  // Default metadata if no custom SEO is set
  return {
    title: lang === 'ar' ? 'اعمل معنا - تيك ستارت' : 'Work With Us - TechStart',
    description: lang === 'ar' 
      ? 'استكشف فرص العمل والتوظيف المتاحة في تيك ستارت. انضم إلى فريقنا وساعدنا في تحقيق مهمتنا.'
      : 'Explore job opportunities and procurement listings at TechStart. Join our team and help us achieve our mission.',
  }
}

export default async function WorkWithUsPage(props: WorkWithUsPageProps) {
  const params = await props.params;
  const { lang } = params;
  const procurementListings = await getWorkWithUsListings("Procurement")
  const recruitmentListings = await getWorkWithUsListings("Recruitment")

  return (
    <>
      <SeoMetadata 
        path="/work-with-us" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'اعمل معنا - تيك ستارت' : 'Work With Us - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'استكشف فرص العمل والتوظيف المتاحة في تيك ستارت. انضم إلى فريقنا وساعدنا في تحقيق مهمتنا.'
          : 'Explore job opportunities and procurement listings at TechStart. Join our team and help us achieve our mission.'
        }
      />
      <WorkWithUs 
        procurementListings={procurementListings} 
        recruitmentListings={recruitmentListings} 
      />
    </>
  )
}
