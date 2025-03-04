import { getDashboardData } from "@/app/actions/getDashboardData"
import DashboardClient from "@/components/admin/dashboard-client"

export default async function DashboardPage() {
  const dashboardData = await getDashboardData()

  return <DashboardClient dashboardData={dashboardData} />
}

