"use client";

import { SiteProvider } from "@/context/SiteContext";

export default function MohamadmonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteProvider>{children}</SiteProvider>;
} 