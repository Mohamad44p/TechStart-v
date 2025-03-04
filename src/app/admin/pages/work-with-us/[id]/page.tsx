import { getWorkWithUsListingById } from "@/app/actions/pages/work-with-us-actions"
import { WorkWithUsForm } from "@/components/admin/pages/work-with-us-form"
import { notFound } from "next/navigation"

export default async function EditWorkWithUsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const listing = await getWorkWithUsListingById(params.id)

  if (!listing) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Work With Us Listing</h1>
      <WorkWithUsForm initialData={listing} />
    </div>
  )
}

