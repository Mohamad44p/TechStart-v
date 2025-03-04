import { LangCode } from '@/config/languages';

type TranslationsType = {
  [key in LangCode]: {
    [key: string]: string;
  };
};

export const translations: TranslationsType = {
  en: {
    welcome: 'Welcome to Tech Start',
    programs: 'Our Programs',
    // Add more translations
  },
  ar: {
    welcome: 'مرحباً بكم في تيك ستارت',
    programs: 'برامجنا',
    // Add more translations
  },
};

export function getTranslation(key: string, lang: LangCode) {
  return translations[lang][key] || key;
}
