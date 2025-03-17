"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Edit, 
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from "lucide-react"

type SeoPage = {
  id: string
  name_en: string
  name_ar: string
  path: string
  type: string
  hasMetadata: boolean
}

interface SeoPageListProps {
  initialPages: SeoPage[]
}

export function SeoPageList({ initialPages }: SeoPageListProps) {
  const [pages] = useState<SeoPage[]>(initialPages)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const router = useRouter()

    const getPageTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return 'Home'
      case 'program':
        return 'Program'
      case 'blog':
        return 'News & Press Releases'
      case 'gallery':
        return 'Gallery'
      case 'about':
        return 'About'
      case 'contact':
        return 'Contact'
      case 'custom':
        return 'Custom'
      default:
        return type
    }
  }

  const getPageTypeBadge = (type: string) => {
    switch (type) {
      case 'home':
        return <Badge variant="default">Home</Badge>
      case 'program':
        return <Badge variant="secondary">Program</Badge>
      case 'blog':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">News & Press Releases</Badge>
      case 'gallery':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Gallery</Badge>
      case 'about':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">About</Badge>
      case 'contact':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Contact</Badge>
      case 'custom':
        return <Badge variant="outline">Custom</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page Name</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>SEO Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No pages found.
              </TableCell>
            </TableRow>
          ) : (
            pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.name_en}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="truncate max-w-[200px]">{page.path}</span>
                    <a 
                      href={`${window.location.origin}${page.path}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </TableCell>
                <TableCell>{getPageTypeBadge(page.type)}</TableCell>
                <TableCell>
                  {isLoading[page.id] ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full mr-2"></div>
                      <span>Checking...</span>
                    </div>
                  ) : page.hasMetadata ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span>Configured</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-600">
                      <AlertCircle size={16} className="mr-2" />
                      <span>Not configured</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => router.push(`/admin/seo/edit?path=${encodeURIComponent(page.path)}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>{page.hasMetadata ? "Edit SEO" : "Add SEO"}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 