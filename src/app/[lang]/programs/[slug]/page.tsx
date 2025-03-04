import { notFound } from "next/navigation";
import db from "@/app/db/db";
import DynamicHero from "@/components/programs/dynamic-hero";
import DynamicTabs from "@/components/programs/dynamic-tabs";
import NavbarPositionSetter from './NavbarPositionSetter';

export const dynamic = "force-dynamic"

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

export default async function DynamicProgramPage(
  props: {
    params: Promise<{ lang: string; slug: string }>
  }
) {
  const params = await props.params;
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
