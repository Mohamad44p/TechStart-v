export interface NavTranslations {
  programs: string;
  aboutUs: string;
  mediaCenter: string;
  safeguards: string;
  contactUs: string;
  menuItems: {
    programs: ProgramMenuItems;
    aboutUs: AboutUsMenuItems;
    mediaCenter: MediaCenterMenuItems;
    contactUs: ContactUsMenuItems;
  };
}

export interface ProgramData {
  id: string;
  name_en: string;
  name_ar: string;
  ProgramTab: {
    id: string;
    title_en: string;
    title_ar: string;
    slug: string;
  }[];
}

export interface ProgramMenuItems {
  programs: ProgramData[];
  buildingCapabilities: string;
  upskill: string;
  elevate: string;
  femtech: string;
  improvingEcosystem: string;
  pioneer: string;
  marketAccess: string;
  horizon: string;
}

export interface AboutUsMenuItems {
  whoWeAre: string;
  partners: string;
  itLeads: string;
  workWithUs: string;
}

export interface MediaCenterMenuItems {
  gallery: string;
  photoGallery: string;
  videos: string;
  news: string;
  newsPress: string;
  publications: string;
  announcements: string;
}

export interface ContactUsMenuItems {
  contact: string;
  complaints: string;
  faqs: string;
}

export interface Position {
  left: number;
  width: number;
  opacity: number;
  isRtl?: boolean;  // Add optional isRtl property
}

export interface DropdownProps {
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  translations: NavTranslations;
  currentLang?: string;  // Add optional currentLang property
}
