import React from "react";
import HeroWrapper from "@/components/shared/Hero/HeroWrapper";
import StatsWrapper from "@/components/Stats/StatsWrapper";
import ProgramsWrapper from "@/components/shared/program/ProgramsWrapper";
import MediaCenterWrapper from "@/components/shared/Hero/MediaCenterWrapper";
import HomeBannerWrapper from "@/components/shared/banners/HomeBannerWrapper";

export default function Page() {
  return (
    <main className="relative">
      <HeroWrapper />
      <section>
        <StatsWrapper />
      </section>
      <section>
        <ProgramsWrapper />
      </section>
      <section>
        <MediaCenterWrapper />
      </section>
      <HomeBannerWrapper />
    </main>
  );
}
