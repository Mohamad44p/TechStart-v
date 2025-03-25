'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setLoading } = useLoading();

  useEffect(() => {
    // This effect runs on route change
    setLoading(true);
    
    // Scroll to the top of the page on navigation
    window.scrollTo(0, 0);
    
    // Add a small timeout to ensure the loader is visible
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, searchParams, setLoading]);

  return null;
}

export default NavigationEvents; 