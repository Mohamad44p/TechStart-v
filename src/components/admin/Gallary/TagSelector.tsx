/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createTag } from "@/app/actions/tagActions"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Tag {
  id: string
  name_en: string
  name_ar: string
}

interface TagSelectorProps {
  tags: Tag[]
  selectedTags: string[]
  onChange: (value: string[]) => void
  onNewTag?: (tag: Tag) => void
}

export function TagSelector({ tags, selectedTags, onChange, onNewTag }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newTag, setNewTag] = useState({ name_en: "", name_ar: "" })
  const { toast } = useToast()

  const handleCreateTag = async () => {
    if (!newTag.name_en || !newTag.name_ar) return

    setIsLoading(true)
    try {
      const result = await createTag({
        name_en: newTag.name_en.trim(),
        name_ar: newTag.name_ar.trim(),
      })

      if (result.success && result.data) {
        toast({ title: "Success", description: "Tag created successfully" })
        onChange([...selectedTags, result.data.id])
        onNewTag?.(result.data)
        setIsOpen(false)
        setNewTag({ name_en: "", name_ar: "" })
      } else {
        toast({ 
          title: "Error", 
          description: typeof result.error === 'object' ? JSON.stringify(result.error) : result.error || "Failed to create tag", 
          variant: "destructive" 
        })
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to create tag", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? (
              <div 
                key={tag.id} 
                className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
              >
                <span>{tag.name_en} / {tag.name_ar}</span>
                <button
                  type="button"
                  onClick={() => onChange(selectedTags.filter(id => id !== tag.id))}
                  className="hover:text-destructive"
                >
                  ×
                </button>
              </div>
            ) : null;
          })}
        </div>
        <Select
          value={undefined}
          onValueChange={(value) => {
            if (value && !selectedTags.includes(value)) {
              onChange([...selectedTags, value])
            }
          }}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Add tags..." />
          </SelectTrigger>
          <SelectContent>
            {tags
              .filter((tag) => !selectedTags.includes(tag.id))
              .map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name_en} / {tag.name_ar}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="english">English</TabsTrigger>
              <TabsTrigger value="arabic">Arabic</TabsTrigger>
            </TabsList>
            <TabsContent value="english">
              <Input 
                placeholder="Enter English tag name"
                value={newTag.name_en}
                onChange={(e) => setNewTag({ ...newTag, name_en: e.target.value })}
              />
            </TabsContent>
            <TabsContent value="arabic">
              <Input 
                placeholder="أدخل اسم العلامة بالعربية"
                value={newTag.name_ar}
                onChange={(e) => setNewTag({ ...newTag, name_ar: e.target.value })}
                className="text-right"
                dir="rtl"
              />
            </TabsContent>
          </Tabs>
          <Button 
            onClick={handleCreateTag} 
            disabled={isLoading || !newTag.name_en || !newTag.name_ar}
            className="w-full mt-4"
          >
            {isLoading ? "Creating..." : "Create Tag"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

