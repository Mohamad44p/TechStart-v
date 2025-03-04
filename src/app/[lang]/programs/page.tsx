import { getPrograms } from "@/app/actions/program-page-actions"
import Link from "next/link"

export const dynamic = "force-dynamic"


export default async function ProgramsPage(
  props: {
    params: Promise<{ lang: string }>
  }
) {
  const params = await props.params;

  const {
    lang
  } = params;

  const { programs } = await getPrograms()

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Our Programs</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs?.map((program) => (
          <Link
            key={program.id}
            href={`/${lang}/programs/${program.id}`}
            prefetch
            passHref
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">
              {lang === 'ar' ? program.name_ar : program.name_en}
            </h2>
            {/* Add more program details as needed */}
          </Link>
        ))}
      </div>
    </div>
  )
}
