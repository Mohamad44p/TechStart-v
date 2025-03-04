import db from "@/app/db/db"
import { BeneficiaryForm } from "../components/BeneficiaryForm"

export default async function CreateBeneficiaryPage() {
  const categories = await db.category.findMany()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Beneficiary</h1>
      <BeneficiaryForm 
        categories={categories}
        mode="create"
        buttonText="Create Beneficiary"
      />
    </div>
  )
}
