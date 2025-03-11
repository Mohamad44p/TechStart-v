import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSeoPages, getSeoMetadataForPage } from "@/app/actions/seo-actions"
import { SeoMetadataForm } from "../components/SeoMetadataForm"

export const metadata: Metadata = {
  title: "Edit SEO Metadata",
  description: "Edit SEO metadata for a specific page",
}

interface SeoEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SeoEditPage(props: SeoEditPageProps) {
  const params = await props.params;
  const { id } = params

  // Get the page details
  const pagesResult = await getSeoPages()
  if (!pagesResult.success) {
    throw new Error("Failed to fetch pages")
  }

  const page = pagesResult.pages.find(p => p.id === id)
  if (!page) {
    notFound()
  }

  // Get existing metadata if any
  const metadataResult = await getSeoMetadataForPage(id)
  const existingMetadata = metadataResult.success ? metadataResult.metadata : null

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit SEO Metadata</h1>
        <p className="text-muted-foreground mt-2">
          Edit SEO metadata for <span className="font-medium">{page.name_en}</span> ({page.path})
        </p>
      </div>
      
      <SeoMetadataForm 
        page={page} 
        initialData={existingMetadata} 
      />
    </div>
  )
} 