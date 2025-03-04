import { getStats } from "@/app/actions/pages/statActions"
import { StatsList } from "@/components/admin/pages/StatsList"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminStatsPage() {
  const response = await getStats()

  if (!response.success) {
    const errorMessage = typeof response.error === 'string' 
      ? response.error 
      : 'An unexpected error occurred'
    return <div>Error loading stats: {errorMessage}</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Stats</h1>
        <Link href="/admin/pages/stats/create" passHref prefetch>
          <Button>Add New Stat</Button>
        </Link>
      </div>
      <StatsList stats={response.data} />
    </div>
  )
}

