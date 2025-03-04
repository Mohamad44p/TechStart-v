"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createCategory } from "@/app/actions/beneficiaryActions"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Category {
  id: string
  name_en: string
  name_ar: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

interface CategorySelectorProps {
  categories: Category[]
  value: string
  onChange: (value: string) => void
  onNewCategory?: (category: Category) => void
}

export function CategorySelector({ categories, value, onChange, onNewCategory }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [nameEn, setNameEn] = useState("")
  const [nameAr, setNameAr] = useState("")
  const { toast } = useToast()

  const handleCreateCategory = async () => {
    if (!nameEn || !nameAr) return

    setIsLoading(true)
    try {
      const result = await createCategory({ name_en: nameEn, name_ar: nameAr, slug: "" })
      if (result.success && result.data) {
        toast({ title: "Success", description: "Category created successfully" })
        onChange(result.data.id)
        onNewCategory?.(result.data)
        setIsOpen(false)
        setNameEn("")
        setNameAr("")
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name_en} / {category.name_ar}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="english" className="w-full">English</TabsTrigger>
              <TabsTrigger value="arabic" className="w-full">Arabic</TabsTrigger>
            </TabsList>
            <TabsContent value="english">
              <Input
                placeholder="Category name in English"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
            </TabsContent>
            <TabsContent value="arabic">
              <Input
                placeholder="Category name in Arabic"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                dir="rtl"
              />
            </TabsContent>
          </Tabs>
          <Button onClick={handleCreateCategory} disabled={isLoading}>
            Create Category
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
