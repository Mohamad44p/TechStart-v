import { notFound } from "next/navigation";
import db from "@/app/db/db";

export default async function EligibilityPage(
  props: {
    params: Promise<{ lang: string; slug: string }>;
  }
) {
  const params = await props.params;
  const program = await db.programsPages.findFirst({
    where: { id: params.slug },
    include: {
      ProgramsHero: true,
    },
  });

  if (!program?.ProgramsHero[0]) {
    notFound();
  }

  const hero = program.ProgramsHero[0];
  const content = params.lang === "ar" ? hero.eligibility_ar : hero.eligibility_en;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 prose max-w-none">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#1C6AAF] to-[#872996] bg-clip-text text-transparent">
            {params.lang === "ar" ? "معايير الأهلية" : "Eligibility Criteria"}
          </h1>
          <div
            className="mt-6"
            dangerouslySetInnerHTML={{ __html: content || "" }}
          />
        </div>
      </div>
    </main>
  );
}
