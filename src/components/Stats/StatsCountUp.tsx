"use client"

import { useCountUp } from "@/lib/useCountUp"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"
import type { StatData, LanguageType } from "@/types/stats"
import { AVAILABLE_ICONS, type IconName } from "@/config/icons"

interface StatsCountUpProps {
  stats: StatData[]
}

export default function StatsCountUp({ stats }: StatsCountUpProps) {
  const { currentLang } = useLanguage()

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#1b316e] to-[#862996] bg-clip-text text-transparent sm:text-4xl">
              {currentLang === "ar" ? "تيك ستارت بالأرقام" : "TechStart In Numbers"}
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#1b316e] to-[#862996] mx-auto rounded-full mt-4 mb-8" />
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Stat key={stat.name_en} {...stat} currentLang={currentLang} />
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function Stat({ name_en, name_ar, value, icon,  currentLang }: StatData & { currentLang: LanguageType }) {
  const { count, ref, controls } = useCountUp(value)
  const Icon = AVAILABLE_ICONS[icon as IconName] as React.ComponentType<{ className?: string }>

  const formatNumber = (num: number) => {
    const hasDecimal = num % 1 !== 0;
    return num.toLocaleString("en-US", {
      minimumFractionDigits: hasDecimal ? 1 : 0,
      maximumFractionDigits: 1
    })
  }

  if (!Icon) {
    console.error(`Icon not found: ${icon}`)
    return null
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex flex-col h-[200px] rounded-2xl bg-white px-6 py-8 shadow-lg transition-all hover:shadow-xl"
    >
      <dt className="flex items-center gap-3 text-lg font-semibold leading-7 text-[#142451]">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50">
          <Icon className="h-6 w-6 text-[#862996]" />
        </div>
        {currentLang === "ar" ? name_ar : name_en}
      </dt>
      <dd className="mt-auto flex flex-col items-center">
        <div className="flex items-baseline justify-center">
          <p className="text-4xl font-bold tracking-tight text-[#142451]">
            {formatNumber(count)}
          </p>
        </div>
        <div className="mt-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#4169E1] to-[#000080]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </div>
      </dd>
    </motion.div>
  )
}

