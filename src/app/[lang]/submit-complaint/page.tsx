import SubmitComplaintPage from "@/components/submit-complaint/submit-complaint-page";
import { SeoMetadata } from "@/components/shared/SeoMetadata";
import { Metadata } from "next";

interface SubmitComplaintProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: SubmitComplaintProps): Promise<Metadata> {
  const { lang } = params;
  
  return {
    title: lang === 'ar' ? 'تقديم شكوى - تيك ستارت' : 'Submit Complaint - TechStart',
    description: lang === 'ar' 
      ? 'قدم شكوى أو ملاحظة إلى فريق تيك ستارت. نحن نأخذ جميع الشكاوى على محمل الجد ونسعى لتحسين خدماتنا.'
      : 'Submit a complaint or feedback to the TechStart team. We take all complaints seriously and strive to improve our services.',
  }
}

export default function SubmitComplaint({ params }: SubmitComplaintProps) {
  return (
    <>
      <SeoMetadata 
        path="/submit-complaint" 
        lang={params.lang} 
        defaultTitle={params.lang === 'ar' ? 'تقديم شكوى - تيك ستارت' : 'Submit Complaint - TechStart'}
        defaultDescription={params.lang === 'ar' 
          ? 'قدم شكوى أو ملاحظة إلى فريق تيك ستارت. نحن نأخذ جميع الشكاوى على محمل الجد ونسعى لتحسين خدماتنا.'
          : 'Submit a complaint or feedback to the TechStart team. We take all complaints seriously and strive to improve our services.'
        }
      />
      <SubmitComplaintPage />
    </>
  );
}

