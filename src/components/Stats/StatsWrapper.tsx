import { getStats } from "@/app/actions/pages/statActions"
import StatsCountUp from "./StatsCountUp"
import type { StatData } from "@/types/stats"

export default async function StatsWrapper() {
  const response = await getStats()

  if (!response.success) {
    console.error("Failed to fetch stats:", response.error)
    return <div>Error loading stats</div>
  }

  const stats: StatData[] = response.data.map((stat) => ({
    name_en: stat.name_en,
    name_ar: stat.name_ar,
    value: stat.value,
    icon: stat.icon,
    suffix_en: stat.suffix_en,
    suffix_ar: stat.suffix_ar
  }))

  return <StatsCountUp stats={stats} />
}


