import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import LenisProvider from "@/components/lenis/ReactLenisW";
import { ConditionalNavbar } from "@/components/shared/Nav/ConditionalNavbar";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/LanguageContext";
import { LoadingProvider } from "@/context/LoadingContext";
import PageLoader from "@/components/ui/PageLoader";
import NavigationEvents from "@/components/navigation/NavigationEvents";
import FooterWrapper from "@/components/shared/Footer/FooterWrapper";
import { languages } from "@/config/languages";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const neoSans = localFont({
  src: "./fonts/neo-sans-arabic/Neo Sans Arabic Regular.ttf",
  variable: "--font-neo-sans",
  display: "swap",
});

// Define your base URL
const baseUrl = 'https://techstart.ps';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  // Validate the language or default to 'en'
  const lang = params.lang in languages ? params.lang : 'en';
  
  return {
    title: languages[lang as keyof typeof languages].title,
    description: lang === 'en' 
      ? "Tech Start is a tech company that provides advanced training programs." 
      : "تيك ستارت هي شركة تقنية توفر برامج تدريب متقدمة.",
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: Object.keys(languages).reduce((acc, langCode) => {
        acc[langCode] = `${baseUrl}/${langCode}`;
        return acc;
      }, {} as Record<string, string>),
    },
    openGraph: {
      title: languages[lang as keyof typeof languages].title,
      description: lang === 'en' 
        ? "Tech Start is a tech company that provides advanced training programs." 
        : "تيك ستارت هي شركة تقنية توفر برامج تدريب متقدمة.",
      url: `${baseUrl}/${lang}`,
      siteName: 'Tech Start',
      images: [
        {
          url: `${baseUrl}/TechLogo.svg`,
          width: 1200,
          height: 630,
          alt: 'Tech Start',
        },
      ],
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: languages[lang as keyof typeof languages].title,
      description: lang === 'en' 
        ? "Tech Start is a tech company that provides advanced training programs." 
        : "تيك ستارت هي شركة تقنية توفر برامج تدريب متقدمة.",
      images: [`${baseUrl}/TechLogo.svg`],
    },
  };
}

export default async function LanguageLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;

  const { children } = props;

  return (
    <div
      dir={params.lang === "ar" ? "rtl" : "ltr"}
      lang={params.lang}
      className={
        params.lang === "en"
          ? `font-sans ${montserrat.variable}`
          : `font-serif ${neoSans.variable}`
      }
    >
      <LanguageProvider defaultLang={params.lang}>
        <LoadingProvider>
          <PageLoader />
          <NavigationEvents />
          <LenisProvider>
            <div className="flex min-h-screen flex-col">
              <ConditionalNavbar />
              {children}
              <FooterWrapper />
            </div>
            <Toaster />
          </LenisProvider>
        </LoadingProvider>
      </LanguageProvider>
      <div id="modal-root" />
    </div>
  );
}
