import React from 'react'
import { HomeBannerForm } from "./components/HomeBannerForm"
import db from "@/app/db/db"

export default async function HomeBannerPage() {
  const banner = await db.homeBanner.findFirst()

  const transformedBanner = banner ? {
    ...banner,
    imageUrl: banner.imageUrl || undefined
  } : undefined

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Home Banner Settings</h1>
      <HomeBannerForm initialData={transformedBanner} />
    </div>
  )
}
