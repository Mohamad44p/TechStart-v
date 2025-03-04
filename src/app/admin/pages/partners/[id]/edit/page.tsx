import { getPartnerPages } from "@/app/actions/pages/partner-actions"
import { PartnerPageForm } from "@/components/admin/pages/PartnerPageForm"
import { notFound } from "next/navigation"

export default async function EditPartnerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data: partnerPages } = await getPartnerPages()
  const partnerPage = partnerPages?.find((p) => p.id === params.id)

  if (!partnerPage) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Partner Page</h1>
      <PartnerPageForm initialData={partnerPage} partnerId={params.id} buttonText="Update Partner Page" />
    </div>
  )
}

