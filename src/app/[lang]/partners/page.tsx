import { getPartnerPages } from "@/app/actions/pages/partner-actions"
import PartnersPageClient from "@/components/shared/Clients/PartnersPage"
import type { PartnerPage } from "@/types/partner"

export const dynamic = "force-dynamic"


export default async function PartnersWrapper() {
  const { data: partnerPages, error } = await getPartnerPages()

  if (error) {
    console.error("Failed to fetch partner pages:", error)
    return <div>Error loading partner pages</div>
  }

  const partners: PartnerPage[] = partnerPages || []

  return <PartnersPageClient partners={partners} />
}

