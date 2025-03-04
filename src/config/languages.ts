export const languages = {
  en: {
    name: 'English',
    dir: 'ltr',
    title: 'Tech Start - Advanced Training Programs',
  },
  ar: {
    name: 'العربية',
    dir: 'rtl',
    title: 'تيك ستارت - برامج تدريب متقدمة',
  },
} as const;

export type LangCode = keyof typeof languages;
