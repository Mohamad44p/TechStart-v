import React from 'react'
import { SafeguardForm } from "../components/SafeguardForm"

export default async function CreateSafeguardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Safeguard</h1>
      <SafeguardForm 
        mode="create"
        buttonText="Create Safeguard"
      />
    </div>
  )
}
