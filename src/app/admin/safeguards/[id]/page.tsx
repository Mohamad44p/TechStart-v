import React from 'react'
import { notFound } from "next/navigation"
import db from "@/app/db/db"
import { SafeguardForm } from "../components/SafeguardForm"

export default async function EditSafeguardPage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;

  const {
    id
  } = params;

  const safeguard = await db.safeguard.findUnique({
    where: { id },
  })

  if (!safeguard) {
    notFound()
  }

  const transformedData = {
    ...safeguard,
    imageUrl: safeguard.imageUrl || undefined,
    attachmentUrl: safeguard.attachmentUrl || undefined,
    longDescription_en: safeguard.longDescription_en || undefined,
    longDescription_ar: safeguard.longDescription_ar || undefined
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Safeguard</h1>
      <SafeguardForm
        initialData={transformedData}
        mode="edit"
        id={id}
        buttonText="Update Safeguard"
      />
    </div>
  )
}
