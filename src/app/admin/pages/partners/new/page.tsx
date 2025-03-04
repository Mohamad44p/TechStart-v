import { PartnerPageForm } from "@/components/admin/pages/PartnerPageForm"

export default function NewPartnerPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Partner Page</h1>
      <PartnerPageForm buttonText="Create Partner Page" />
    </div>
  )
}

