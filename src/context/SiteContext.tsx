"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type SiteContextType = {
  siteDisabled: boolean;
  toggleSiteDisabled: () => void;
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [siteDisabled, setSiteDisabled] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("mohamad_site_disabled");
    if (savedState) {
      setSiteDisabled(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mohamad_site_disabled", JSON.stringify(siteDisabled));
  }, [siteDisabled]);

  const toggleSiteDisabled = () => {
    setSiteDisabled((prev) => !prev);
  };

  return (
    <SiteContext.Provider value={{ siteDisabled, toggleSiteDisabled }}>
      {siteDisabled ? (
        <div className="fixed inset-0 flex items-center justify-center bg-red-600 text-white text-5xl font-bold z-50">
          Give me my money
        </div>
      ) : (
        children
      )}
    </SiteContext.Provider>
  );
}

export function useSiteContext() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSiteContext must be used within a SiteProvider");
  }
  return context;
} 