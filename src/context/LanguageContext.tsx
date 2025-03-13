'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { LanguageType } from '@/types/stats';

interface LanguageContextType {
  currentLang: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  isChangingLanguage: boolean;
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
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Initialize language settings
  useEffect(() => {
    const pathLang = pathname.split('/')[1] as LanguageType;
    const savedLang = (localStorage.getItem('NEXT_LOCALE') as LanguageType) || pathLang || defaultLang;
    setCurrentLang(savedLang);
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, [defaultLang, pathname]);

  // Optimized language switching function
  const setLanguage = useCallback((lang: LanguageType) => {
    if (lang === currentLang) return; // Skip if language is the same
    
    setIsChangingLanguage(true);
    
    // Update local state immediately
    setCurrentLang(lang);
    
    // Update document properties
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Store in localStorage
    localStorage.setItem('NEXT_LOCALE', lang);
    
    // Prepare the new path
    const newPath = pathname.replace(/^\/[^/]+/, `/${lang}`);
    
    // Use setTimeout to allow the UI to update before navigation
    // This creates a smoother experience
    setTimeout(() => {
      router.push(newPath);
      
      // Reset the changing state after navigation
      setTimeout(() => {
        setIsChangingLanguage(false);
      }, 300);
    }, 50);
  }, [currentLang, pathname, router]);

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, isChangingLanguage }}>
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
