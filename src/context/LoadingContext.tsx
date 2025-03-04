"use client";

import { createContext, useContext, useState, useCallback } from "react";

type LoadingContextType = {
  isPreloaderComplete: boolean;
  completeLoading: () => void;
  isFirstLoad: boolean;
};

const LoadingContext = createContext<LoadingContextType>({
  isPreloaderComplete: false,
  completeLoading: () => {},
  isFirstLoad: true,
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isPreloaderComplete, setPreloaderComplete] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const completeLoading = useCallback(() => {
    setPreloaderComplete(true);
    setIsFirstLoad(false);
    document.querySelector('body')?.classList.add('preloader-complete');
  }, []);

  return (
    <LoadingContext.Provider value={{ isPreloaderComplete, completeLoading, isFirstLoad }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);