'use client'

import { FooterForm } from "../../components/FooterForm"
import { updateFooter } from "@/app/actions/pages/footerActions"
import { FooterFormInput } from "@/lib/schema/footerSchema"

interface EditFooterFormProps {
  initialData: FooterFormInput
  footerId: string
}

export default function EditFooterForm({ initialData, footerId }: EditFooterFormProps) {
  const handleSubmit = async (data: FooterFormInput) => {
    return updateFooter(footerId, data)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Footer</h1>
      <FooterForm 
        initialData={initialData} 
        onSubmit={handleSubmit}
        buttonText="Update Footer" 
      />
    </div>
  )
}
