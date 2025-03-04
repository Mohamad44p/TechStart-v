import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
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
        <LanguageProvider defaultLang={params.lang}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
