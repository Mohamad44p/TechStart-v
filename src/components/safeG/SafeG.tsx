import React from "react";
import { getSafeguards } from "@/app/actions/safeguardActions";
import { SafeScroll } from "./safe-scroll";
import SafeGHeader from "./SafeGHeader";

interface SafeGProps {
  lang: string;
}

export default async function SafeG({ lang }: SafeGProps) {
  const safeguardsResponse = await getSafeguards();
  const safeguards = safeguardsResponse.success ? safeguardsResponse.data || [] : [];

  return (
    <div className="px-4">
      <SafeGHeader initialLang={lang} />
      <SafeScroll safeguards={safeguards} initialLang={lang} />
    </div>
  );
}
