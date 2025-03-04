import { Montserrat } from "next/font/google"
import LayoutAd from "@/components/admin/LayoutAd"
import { Toaster } from "@/components/ui/toaster"
import React from "react"

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${montserrat.variable} font-sans`}>
      <LayoutAd>{children}</LayoutAd>
      <Toaster />
    </div>
  )
}
