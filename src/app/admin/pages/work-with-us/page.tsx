import { getWorkWithUsListings } from "@/app/actions/pages/work-with-us-actions"
import { WorkWithUsClient } from "./work-with-us-client"

export default async function WorkWithUsPage() {
  const procurementListings = await getWorkWithUsListings("Procurement")
  const recruitmentListings = await getWorkWithUsListings("Recruitment")

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Work With Us</h1>
      <WorkWithUsClient procurementListings={procurementListings} recruitmentListings={recruitmentListings} />
    </div>
  )
}

