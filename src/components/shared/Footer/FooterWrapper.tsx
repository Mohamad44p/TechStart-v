import { getFooter } from "@/app/actions/pages/footerActions";
import Footer from "./Footer";

const defaultFooterData = {
  id: "",
  techStartTitle_en: "TechStart",
  techStartTitle_ar: "تك ستارت",
  titleColor: "#1b316e",
  gradientColor: "#862996",
  instagram: null,
  linkedin: null,
  facebook: null,
  youtube: null,
  twitter: null,
  partners: []
};

export default async function FooterWrapper() {
  const footerResponse = await getFooter();
  const footerData = footerResponse.success && footerResponse.data 
    ? footerResponse.data 
    : defaultFooterData;

  if (!footerResponse.success) {
    console.error("Failed to fetch footer data:", footerResponse.error);
  }

  return <Footer footerData={footerData} />;
}
