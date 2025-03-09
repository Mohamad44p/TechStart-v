import { notFound } from "next/navigation";
import db from "@/app/db/db";
import { SeoMetadata } from "@/components/shared/SeoMetadata";
import { Metadata } from "next";

interface EligibilityPageProps {
  params: {
    lang: string;
    slug: string;
  };
}

async function getProgram(slug: string) {
  try {
    const program = await db.programsPages.findFirst({
      where: { id: slug },
      include: {
        ProgramsHero: true,
      },
    });
    return program;
  } catch (error) {
    console.error("Failed to fetch program:", error);
    return null;
  }
}

export async function generateMetadata({ params }: EligibilityPageProps): Promise<Metadata> {
  const { lang, slug } = params;
  const program = await getProgram(slug);
  
  if (!program || !program.ProgramsHero[0]) {
    return {
      title: lang === 'ar' ? 'معايير الأهلية غير موجودة - تيك ستارت' : 'Eligibility Criteria Not Found - TechStart',
      description: lang === 'ar' ? 'لم يتم العثور على معايير الأهلية المطلوبة' : 'The requested eligibility criteria could not be found',
    };
  }
  
  const title = lang === 'ar' 
    ? `معايير الأهلية: ${program.name_ar} - تيك ستارت` 
    : `Eligibility Criteria: ${program.name_en} - TechStart`;
  
  const description = lang === 'ar'
    ? `تعرف على معايير الأهلية للمشاركة في برنامج ${program.name_ar} من تيك ستارت.`
    : `Learn about the eligibility criteria for participating in TechStart's ${program.name_en} program.`;
  
  return {
    title,
    description,
  };
}

export default async function EligibilityPage({ params }: EligibilityPageProps) {
  const program = await getProgram(params.slug);

  if (!program?.ProgramsHero[0]) {
    notFound();
  }

  const hero = program.ProgramsHero[0];
  const content = params.lang === "ar" ? hero.eligibility_ar : hero.eligibility_en;

  return (
    <>
      <SeoMetadata 
        path={`/programs/${params.slug}/eligibility`} 
        lang={params.lang} 
        defaultTitle={params.lang === 'ar' 
          ? `معايير الأهلية: ${program.name_ar} - تيك ستارت` 
          : `Eligibility Criteria: ${program.name_en} - TechStart`
        }
        defaultDescription={params.lang === 'ar'
          ? `تعرف على معايير الأهلية للمشاركة في برنامج ${program.name_ar} من تيك ستارت.`
          : `Learn about the eligibility criteria for participating in TechStart's ${program.name_en} program.`
        }
      />
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
    </>
  );
}
