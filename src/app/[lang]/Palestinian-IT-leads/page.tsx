import { Suspense } from 'react'
import { getBeneficiaries, getCategories } from '@/app/actions/beneficiaryActions'
import { BeneficiariesSection } from '@/components/beneficiary/beneficiaries-section'
import Loading from './loading'

export const revalidate = 30
export const dynamic = "force-dynamic"

export default async function PalestinianITleads() {
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
    <Suspense fallback={<Loading />}>
      <BeneficiariesSection 
        beneficiaries={beneficiariesResponse.data || []}
        categories={categoriesResponse.data || []}
      />
    </Suspense>
  )
}
