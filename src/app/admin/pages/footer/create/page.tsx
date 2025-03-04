import React from 'react'
import { FooterForm } from "../components/FooterForm"
import { createFooter } from "@/app/actions/pages/footerActions"

export default function CreateFooter() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Footer</h1>
      <FooterForm onSubmit={createFooter} />
    </div>
  )
}
