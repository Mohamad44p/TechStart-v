import React from "react";
import HeroWrapper from "@/components/shared/Hero/HeroWrapper";
import StatsWrapper from "@/components/Stats/StatsWrapper";
import ProgramsWrapper from "@/components/shared/program/ProgramsWrapper";
import MediaCenterWrapper from "@/components/shared/Hero/MediaCenterWrapper";
import HomeBannerWrapper from "@/components/shared/banners/HomeBannerWrapper";
import { SeoMetadata } from "@/components/shared/SeoMetadata";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang } = params;

  // Default metadata if no custom SEO is set
  return {
    title: lang === 'ar' ? 'تيك ستارت - الصفحة الرئيسية' : 'TechStart - Home',
    description: lang === 'ar' 
      ? 'تيك ستارت هي منصة تدريب متقدمة تهدف إلى تطوير المهارات التقنية في فلسطين'
      : 'TechStart is an advanced training platform aimed at developing technical skills in Palestine',
  }
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { lang } = params;

  return (
    <>
      <SeoMetadata 
        path="/" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'تيك ستارت - الصفحة الرئيسية' : 'TechStart - Home'}
        defaultDescription={lang === 'ar' 
          ? 'تيك ستارت هي منصة تدريب متقدمة تهدف إلى تطوير المهارات التقنية في فلسطين'
          : 'TechStart is an advanced training platform aimed at developing technical skills in Palestine'
        }
      />
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
    </>
  );
}
