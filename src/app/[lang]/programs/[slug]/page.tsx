import { notFound } from "next/navigation";
import db from "@/app/db/db";
import DynamicHero from "@/components/programs/dynamic-hero";
import DynamicTabs from "@/components/programs/dynamic-tabs";
import NavbarPositionSetter from './NavbarPositionSetter';
import { SeoMetadata } from "@/components/shared/SeoMetadata";
import { Metadata } from "next";

export const dynamic = "force-dynamic"

interface ProgramPageProps {
  params: {
    lang: string;
    slug: string;
  }
}

async function getProgram(slug: string) {
  try {
    const program = await db.programsPages.findFirst({
      where: { id: slug },
      include: {
        ProgramsHero: true,
        ProgramTab: {
          include: {
            buttons: {
              orderBy: {
                order: 'asc'
              }
            }
          },
          orderBy: { 
            createdAt: 'asc' 
          }
        },
        faqCategories: {
          include: {
            faqs: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
    return program;
  } catch (error) {
    console.error("Failed to fetch program:", error);
    return null;
  }
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { lang, slug } = params;
  const program = await getProgram(slug);
  
  if (!program) {
    return {
      title: lang === 'ar' ? 'برنامج غير موجود - تيك ستارت' : 'Program Not Found - TechStart',
      description: lang === 'ar' ? 'لم يتم العثور على البرنامج المطلوب' : 'The requested program could not be found',
    };
  }
  
  // Use program data to create dynamic metadata
  const title = lang === 'ar' 
    ? `${program.name_ar} - تيك ستارت` 
    : `${program.name_en} - TechStart`;
  
  // Since there's no description field in the schema, we'll create a generic one
  const description = lang === 'ar'
    ? `تعرف على برنامج ${program.name_ar} من تيك ستارت وكيف يمكنك المشاركة.`
    : `Learn about TechStart's ${program.name_en} program and how you can participate.`;
  
  return {
    title,
    description,
  };
}

function HashNavigationScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function handleHashChange() {
              const hash = window.location.hash.replace('#', '');
              if (hash) {
                setTimeout(() => {
                  const element = document.getElementById(hash);
                  if (element) {
                    const navbarHeight = 100;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }, 300);
              }
            }
            
            window.addEventListener('load', handleHashChange);
            window.addEventListener('hashchange', handleHashChange);
          })();
        `
      }}
    />
  );
}

export default async function DynamicProgramPage({ params }: ProgramPageProps) {
  const program = await getProgram(params.slug);

  if (!program) {
    notFound();
  }

  const hero = program.ProgramsHero[0];

  const heroWithProgram = hero ? {
    ...hero,
    programPage: program
  } : null;

  const faqsByCategory = program.faqCategories.reduce((acc, category) => {
    acc[category.id] = category.faqs.map(faq => ({
      ...faq,
      category: category 
    }))
    return acc
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any[]>)

  return (
    <>
      <SeoMetadata 
        path={`/programs/${params.slug}`} 
        lang={params.lang} 
        defaultTitle={params.lang === 'ar' 
          ? `${program.name_ar} - تيك ستارت` 
          : `${program.name_en} - TechStart`
        }
        defaultDescription={params.lang === 'ar'
          ? `تعرف على برنامج ${program.name_ar} من تيك ستارت وكيف يمكنك المشاركة.`
          : `Learn about TechStart's ${program.name_en} program and how you can participate.`
        }
      />
      <NavbarPositionSetter />
      <HashNavigationScript />
      <main className="min-h-screen flex flex-col">
        {heroWithProgram && <DynamicHero hero={heroWithProgram} lang={params.lang} />}
        {program.ProgramTab && (
          <DynamicTabs 
            tabs={program.ProgramTab} 
            lang={params.lang} 
            faqCategories={program.faqCategories}
            faqsByCategory={faqsByCategory}
            programName={params.lang === "ar" ? program.name_ar : program.name_en}
          />
        )}
      </main>
    </>
  );
}
