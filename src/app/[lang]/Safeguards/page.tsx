import SafeG from "@/components/safeG/SafeG";
import { SeoMetadata } from "@/components/shared/SeoMetadata";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface SafeguardsPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata(props: SafeguardsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang } = params;

  return {
    title: lang === 'ar' ? 'الضمانات - تيك ستارت' : 'Safeguards - TechStart',
    description: lang === 'ar' 
      ? 'تعرف على ضمانات وسياسات الحماية في تيك ستارت لضمان بيئة آمنة وشاملة للجميع.'
      : 'Learn about TechStart safeguards and protection policies to ensure a safe and inclusive environment for everyone.',
  }
}

export default async function SafeguardsPage(props: SafeguardsPageProps) {
  const params = await props.params;
  return (
    <div>
      <SeoMetadata 
        path="/Safeguards" 
        lang={params.lang} 
        defaultTitle={params.lang === 'ar' ? 'الضمانات - تيك ستارت' : 'Safeguards - TechStart'}
        defaultDescription={params.lang === 'ar' 
          ? 'تعرف على ضمانات وسياسات الحماية في تيك ستارت لضمان بيئة آمنة وشاملة للجميع.'
          : 'Learn about TechStart safeguards and protection policies to ensure a safe and inclusive environment for everyone.'
        }
      />
      <SafeG lang={params.lang} />
    </div>
  );
}
