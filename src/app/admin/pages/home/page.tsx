import { getHeroSteps } from "@/app/actions/pages/hero"
import { HeroPageClient } from "@/components/admin/pages/HeroPageClient"
import { DatabaseErrorDisplay } from "@/components/admin/shared/DatabaseErrorDisplay"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AdminHeroPage() {
  const result = await getHeroSteps()
  
  // Handle database connection errors
  if (!result.success) {
    return (
      <DatabaseErrorDisplay
        title="Manage Hero Steps"
        error={typeof result.error === 'string' ? result.error : 'Unable to connect to the database. Please try again later.'}
        createHref="/admin/pages/home/create"
        createLabel="Add New Hero Step"
      />
    )
  }

  // Handle empty data (no hero steps found)
  if (!result.data || result.data.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Hero Steps</h1>
          <Link href="/admin/pages/home/create" passHref>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Hero Step
            </Button>
          </Link>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">No Hero Steps Found</h2>
          <p className="text-gray-600 mb-4">
            There are currently no hero steps in the database. Click the button above to add a new one.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Hero Steps</h1>
        <Link href="/admin/pages/home/create" passHref>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Hero Step
          </Button>
        </Link>
      </div>
      <HeroPageClient initialSteps={result.data} />
    </div>
  )
}

