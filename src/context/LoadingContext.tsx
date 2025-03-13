'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from './LanguageContext';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentLang } = useLanguage();

  // Track navigation changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleStart = () => {
      setIsLoading(true);
    };
    
    const handleComplete = () => {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 500); // Add a small delay to ensure smooth transitions
    };

    // Listen for route changes
    window.addEventListener('beforeunload', handleStart);
    
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleStart);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Track language changes
  useEffect(() => {
    setIsLoading(true);
    
    // Add a small timeout to simulate loading and ensure smooth transitions
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentLang]);

  // Track pathname changes
  useEffect(() => {
    setIsLoading(true);
    
    // Add a small timeout to simulate loading and ensure smooth transitions
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
} 