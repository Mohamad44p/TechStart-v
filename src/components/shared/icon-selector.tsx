'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {  ChevronDown } from 'lucide-react'
import { AVAILABLE_ICONS, ICON_CATEGORIES, type IconName, type CategoryName } from '@/config/icons'
import React from 'react'

interface IconSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function IconSelector({ value, onChange }: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | 'all'>('all')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [, setShowScrollButtons] = useState({
    left: false,
    right: true
  })

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowScrollButtons({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 5 || clientWidth >= scrollWidth
      })
    }
  }, [])

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [selectedCategory, checkScroll])


  const filteredIcons = Object.entries(AVAILABLE_ICONS).filter(([name]) => {
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
      (ICON_CATEGORIES[selectedCategory as CategoryName] as readonly string[])?.includes(name)
    return matchesSearch && matchesCategory
  })

  const IconComponent = value ? (AVAILABLE_ICONS[value as IconName] as React.ComponentType<{ className?: string }>) : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {IconComponent ? (
              <>
                <IconComponent className="h-5 w-5 text-primary" />
                <span>{value}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Select an icon...</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="sticky top-0 bg-background border-b z-10">
          <div className="p-2">
            <Input
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>
          <ScrollArea className="h-[35px] pb-2">
            <div className="flex gap-1 px-2">
              <Button
                variant={selectedCategory === 'all' ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="h-7"
              >
                All
              </Button>
              {Object.keys(ICON_CATEGORIES).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category as CategoryName)}
                  className="h-7 whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-6 gap-1 p-2">
            {filteredIcons.map(([name, Icon]) => (
              <Button
                key={name}
                variant={value === name ? "default" : "ghost"}
                size="sm"
                className="h-12 p-0"
                onClick={() => {
                  onChange(name)
                  setOpen(false)
                }}
              >
                {React.createElement(Icon as React.ComponentType<{ className?: string }>, { className: "h-4 w-4" })}
              </Button>
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No icons found
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

