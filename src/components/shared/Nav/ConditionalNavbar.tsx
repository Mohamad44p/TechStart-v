'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { useLanguage } from '@/context/LanguageContext'
import { useNavbarStore } from '@/store/navbar-store'

export function ConditionalNavbar() {
  const pathname = usePathname()
  const { currentLang } = useLanguage()
  const { isFixed } = useNavbarStore()

  if (pathname === `/${currentLang}`) {
    return null
  }

  return (
    <div className={isFixed ? '' : 'mt-[6rem]'}>
      <Navbar />
    </div>
  )
}

