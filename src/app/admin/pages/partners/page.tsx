import { getPartnerPages } from "@/app/actions/pages/partner-actions"
import { PartnerPagesDataTable } from "@/components/admin/pages/PartnerPagesDataTable"

export default async function PartnersPage() {
  const { data: partnerPages, error } = await getPartnerPages()

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Partners Management</h1>
      <PartnerPagesDataTable data={partnerPages || []} />
    </div>
  )
}

