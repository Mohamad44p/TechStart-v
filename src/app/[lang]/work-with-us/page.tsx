import { getWorkWithUsListings } from '@/app/actions/pages/work-with-us-actions'
import { WorkWithUs } from '@/components/who-we-are/work-with-us'
import React from 'react'

export const dynamic = "force-dynamic";

export default async function WorkWithUsPage() {
  const procurementListings = await getWorkWithUsListings("Procurement")
  const recruitmentListings = await getWorkWithUsListings("Recruitment")

  return (
    <WorkWithUs 
      procurementListings={procurementListings} 
      recruitmentListings={recruitmentListings} 
    />
  )
}
