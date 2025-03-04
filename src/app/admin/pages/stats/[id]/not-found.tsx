import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Stat Not Found</h2>
        <p className="mt-2 text-muted-foreground">The stat you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/admin/pages/stats" className="mt-4 inline-block">
          <Button>Back to Stats</Button>
        </Link>
      </div>
    </div>
  )
}
