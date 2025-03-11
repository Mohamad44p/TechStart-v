import { Suspense } from "react";
import { ContactAnimation } from "@/components/Contact-us/contact-animation";
import { ContactForm } from "@/components/Contact-us/contact-form";
import { SocialLinks } from "@/components/Contact-us/social-links";
import { getFooter } from "@/app/actions/pages/footerActions";
import { ContactInfo } from "@/components/Contact-us/contact-info";
import { SeoMetadata } from "@/components/shared/SeoMetadata";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ContactPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata(props: ContactPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang } = params;

  // Default metadata if no custom SEO is set
  return {
    title: lang === 'ar' ? 'اتصل بنا - تيك ستارت' : 'Contact Us - TechStart',
    description: lang === 'ar' 
      ? 'تواصل مع فريق تيك ستارت. نحن هنا للإجابة على استفساراتك ومساعدتك في أي شيء تحتاجه.'
      : 'Get in touch with the TechStart team. We are here to answer your questions and help you with anything you need.',
  }
}

export default async function ContactPage(props: ContactPageProps) {
  const params = await props.params;
  const { lang } = params;
  const { data: footerData } = await getFooter();

  const socialLinksData = footerData
    ? {
        facebook: footerData.facebook || undefined,
        instagram: footerData.instagram || undefined,
        linkedin: footerData.linkedin || undefined,
        twitter: footerData.twitter || undefined,
        youtube: footerData.youtube || undefined,
      }
    : null;

  return (
    <>
      <SeoMetadata 
        path="/Contact-us" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'اتصل بنا - تيك ستارت' : 'Contact Us - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'تواصل مع فريق تيك ستارت. نحن هنا للإجابة على استفساراتك ومساعدتك في أي شيء تحتاجه.'
          : 'Get in touch with the TechStart team. We are here to answer your questions and help you with anything you need.'
        }
      />
      <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">
            <span className="bg-clip-text p-5 text-transparent bg-gradient-to-r from-[#1b316e] to-[#1b316e] dark:from-[#3b5998] dark:to-[#3b5998]">
              {lang === "ar" ? "تواصل معنا" : "Contact Us"}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-center text-gray-600 dark:text-gray-300 mb-12">
            {lang === "ar"
              ? "نحن هنا لمساعدتك والإجابة على أي سؤال قد تكون لديك"
              : " We are here to help and answer any question you might have"}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3 space-y-8">
              <Suspense fallback={<div>Loading form...</div>}>
                <ContactForm />
              </Suspense>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <ContactAnimation />
              <ContactInfo />
              <SocialLinks socialLinks={socialLinksData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
