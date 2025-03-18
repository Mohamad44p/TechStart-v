import { Metadata } from "next"
import { getSeoPages } from "@/app/actions/seo-actions"
import { SeoPageList } from "./components/SeoPageList"

export const metadata: Metadata = {
  title: "SEO Management",
  description: "Manage SEO metadata for all pages",
}

export default async function SeoManagementPage() {
  const { pages = [], error } = await getSeoPages()

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">SEO Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage SEO metadata for all pages on your website
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <SeoPageList initialPages={pages} />
      )}
    </div>
  )
} 