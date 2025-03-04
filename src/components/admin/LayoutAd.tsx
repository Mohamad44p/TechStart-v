/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from './sidebar/app-sidebar'
import { Loader2 } from "lucide-react"

function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean)
  return paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`
    return { href, label: path.charAt(0).toUpperCase() + path.slice(1) }
  })
}

export default function LayoutAd({ children }: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const breadcrumbs = generateBreadcrumbs(pathname)

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      if (pathname === '/admin/login') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/verify', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsAuthenticated(true);
          } else {
            router.replace('/admin/login');
          }
        } else {
          router.replace('/admin/login');
        }
      } catch (error) {
        if (!mounted) return;
        router.replace('/admin/login');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

