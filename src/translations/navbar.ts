import { NavTranslations } from "@/types/navbar";

interface NavbarTranslations {
  en: NavTranslations;
  ar: NavTranslations;
}

const navbarTranslations: NavbarTranslations = {
  en: {
    programs: "Programs",
    aboutUs: "About Us",
    mediaCenter: "Media Center",
    safeguards: "Safeguards",
    contactUs: "Contact Us",
    menuItems: {
      programs: {
        programs: [],
        buildingCapabilities: "Building Capabilities",
        upskill: "UPSKILL",
        elevate: "Elevate",
        femtech: "FemTech",
        improvingEcosystem: "Improving IT Ecosystem",
        pioneer: "Pioneer",
        marketAccess: "Market Access",
        horizon: "Horizon",
      },
      aboutUs: {
        whoWeAre: "Who Are We",
        partners: "Our Partners",
        itLeads: "Our Beneficiaries",
        workWithUs: "Work With Us",
      },
      mediaCenter: {
        gallery: "Gallery",
        photoGallery: "Photo Gallery",
        videos: "Videos",
        news: "News",
        newsPress: "News & Press Releases",
        publications: "Publications",
        announcements: "Announcements",
      },
      contactUs: {
        contact: "Contact Us",
        complaints: "Complaints",
        faqs: "FAQs",
      },
    },
  },
  ar: {
    programs: "البرامج",
    aboutUs: "من نحن",
    mediaCenter: "المركز الإعلامي",
    safeguards: "معايير الحماية",
    contactUs: "اتصل بنا",
    menuItems: {
      programs: {
        programs: [],
        buildingCapabilities: "بناء القدرات",
        upskill: "تطوير المهارات",
        elevate: "إرتقاء",
        femtech: "فيمتك",
        improvingEcosystem: "تحسين بيئة تكنولوجيا المعلومات",
        pioneer: "بايونير",
        marketAccess: "الوصول إلى السوق",
        horizon: "هورايزن",
      },
      aboutUs: {
        whoWeAre: "من نحن",
        partners: "شركاؤنا",
        itLeads: "المستفيدون",
        workWithUs: "اعمل معنا",
      },
      mediaCenter: {
        gallery: "معرض الصور",
        photoGallery: "معرض الصور",
        videos: "الفيديوهات",
        news: "الأخبار",
        newsPress: "الأخبار والبيانات الصحفية",
        publications: "المنشورات",
        announcements: "الإعلانات",
      },
      contactUs: {
        contact: "اتصل بنا",
        complaints: "الشكاوى",
        faqs: "الأسئلة الشائعة",
      },
    },
  },
};

export default navbarTranslations;
