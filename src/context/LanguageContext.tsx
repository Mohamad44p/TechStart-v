'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { LanguageType } from '@/types/stats';

interface LanguageContextType {
  currentLang: LanguageType;
  setLanguage: (lang: LanguageType) => void;  // Keep this name consistent
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLang: string;
}

export function LanguageProvider({ children, defaultLang }: LanguageProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState<LanguageType>(defaultLang as LanguageType);

  useEffect(() => {
    const pathLang = pathname.split('/')[1] as LanguageType;
    const savedLang = (localStorage.getItem('NEXT_LOCALE') as LanguageType) || pathLang || defaultLang;
    setCurrentLang(savedLang);
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, [defaultLang, pathname]);

  const setLanguage = (lang: LanguageType) => {
    localStorage.setItem('NEXT_LOCALE', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    setCurrentLang(lang);
    
    const newPath = pathname.replace(/^\/[^/]+/, `/${lang}`);
    router.push(newPath);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
