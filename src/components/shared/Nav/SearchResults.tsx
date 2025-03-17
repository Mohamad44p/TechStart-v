"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, Image as ImageIcon, Video, Bookmark } from 'lucide-react'
import type { SearchResult } from '@/app/actions/search-actions'

interface SearchResultsProps {
  results: SearchResult[]
  isVisible: boolean
  isLoading: boolean
  onResultClick: () => void
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isVisible, 
  isLoading,
  onResultClick 
}) => {
  if (!isVisible) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'program':
        return <Bookmark className="w-4 h-4 text-blue-600" />
      case 'blog':
        return <FileText className="w-4 h-4 text-purple-600" />
      case 'gallery':
        return <ImageIcon className="w-4 h-4 text-green-600" />
      case 'video':
        return <Video className="w-4 h-4 text-red-600" />
      default:
        return <Search className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'program':
        return 'Program'
      case 'blog':
        return 'News & Press Releases'
      case 'gallery':
        return 'Gallery'
      case 'video':
        return 'Video'
      default:
        return type
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[70vh] overflow-y-auto z-50"
      >
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Searching...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p>No results found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {results.map((result) => (
                <li key={`${result.type}-${result.id}`} className="hover:bg-gray-50 transition-colors">
                  <Link 
                    href={result.url} 
                    className="flex items-start p-3 gap-3"
                    onClick={onResultClick}
                  >
                    {result.imageUrl ? (
                      <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={result.imageUrl}
                          alt={result.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center">
                        {getIcon(result.type)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{result.description}</p>
                      <div className="mt-1 flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {getIcon(result.type)}
                          <span className="ml-1">{getTypeLabel(result.type)}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SearchResults 