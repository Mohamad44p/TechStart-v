import './globals.css'
import { AccessibilityDock } from '@/components/ui/accessibility-dock'
import { LanguageProvider } from '@/context/LanguageContext'
import { SiteProvider } from '@/context/SiteContext'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Tech Start',
  description: 'Tech Start Platform',
}

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export default async function RootLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  return (
    <html lang="en" className="lenis lenis-smooth" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans`}>
        {/* SVG Filters for Color Blindness */}
        <svg className="hidden" aria-hidden="true">
          <defs>
            {/* Protanopia (red-blind) */}
            <filter id="protanopia-filter">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0.567, 0.433, 0,     0, 0
                        0.558, 0.442, 0,     0, 0
                        0,     0.242, 0.758, 0, 0
                        0,     0,     0,     1, 0"
              />
            </filter>
            
            {/* Deuteranopia (green-blind) */}
            <filter id="deuteranopia-filter">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0.625, 0.375, 0,   0, 0
                        0.7,   0.3,   0,   0, 0
                        0,     0.3,   0.7, 0, 0
                        0,     0,     0,   1, 0"
              />
            </filter>
            
            {/* Tritanopia (blue-blind) */}
            <filter id="tritanopia-filter">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0.95, 0.05,  0,     0, 0
                        0,    0.433, 0.567, 0, 0
                        0,    0.475, 0.525, 0, 0
                        0,    0,     0,     1, 0"
              />
            </filter>
          </defs>
        </svg>
        
        <SiteProvider>
          <LanguageProvider defaultLang={params.lang}>
            {children}
            <AccessibilityDock />
          </LanguageProvider>
        </SiteProvider>
      </body>
    </html>
  )
}
