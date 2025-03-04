/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { Loader2, Eye, Trash2, Copy, Check, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface UploadedItem {
  id: string
  name: string
  url: string
  type: "file" | "image" | "video"
  mimeType: string
  size: number
  createdAt: string
}

type SortField = 'name' | 'type' | 'size' | 'createdAt'
type SortOrder = 'asc' | 'desc'

export function FilesList() {
  const [items, setItems] = useState<UploadedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<UploadedItem | null>(null)
  const [copying, setCopying] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/universal-upload')
      const data = await response.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (error) {
      console.error("Failed to fetch items:", error)
      toast({
        title: "Error",
        description: "Failed to fetch items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/universal-upload/delete/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Delete failed")

      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
      fetchItems()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopying(id)
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      })
      setTimeout(() => setCopying(null), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const sortItems = (items: UploadedItem[]) => {
    return [...items].sort((a, b) => {
      if (sortField === 'size') {
        return sortOrder === 'asc' ? a.size - b.size : b.size - a.size
      }
      if (sortField === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return sortOrder === 'asc'
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField])
    })
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="file">Files</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
              Name {sortField === 'name' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
            </TableHead>
            <TableHead onClick={() => handleSort('type')} className="cursor-pointer">
              Type {sortField === 'type' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
            </TableHead>
            <TableHead onClick={() => handleSort('size')} className="cursor-pointer">
              Size {sortField === 'size' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
            </TableHead>
            <TableHead onClick={() => handleSort('createdAt')} className="cursor-pointer">
              Uploaded {sortField === 'createdAt' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortItems(filteredItems).length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            sortItems(filteredItems).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="capitalize">{item.type}</TableCell>
                <TableCell>{formatFileSize(item.size)}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(item.url, item.id)}
                    >
                      {copying === item.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedItem?.type === "image" && (
              <div className="relative h-[400px]">
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            {selectedItem?.type === "video" && (
              <video controls className="w-full">
                <source src={selectedItem.url} type={selectedItem.mimeType} />
                Your browser does not support the video tag.
              </video>
            )}
            {selectedItem?.type === "file" && (
              <iframe
                src={selectedItem.url}
                className="w-full h-[600px]"
                title={selectedItem.name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
