/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { ProgramCategory } from "@prisma/client";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/program-actions";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

interface CategoryDialogProps {
  categories: Omit<ProgramCategory, 'programs'>[];
  onCategoriesUpdate: (categories: ProgramCategory[]) => void;
}

export function CategoryDialog({ categories, onCategoriesUpdate }: CategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name_en, setNameEn] = useState("");
  const [name_ar, setNameAr] = useState("");
  const [editingCategory, setEditingCategory] = useState<ProgramCategory | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name_en || !name_ar) {
      toast({
        title: "Validation Error",
        description: "Please fill in both English and Arabic names",
        variant: "destructive",
      });
      return;
    }

    try {
      let result;
      if (editingCategory) {
        result = await updateCategory({
          id: editingCategory.id,
          name_en,
          name_ar,
        });
      } else {
        result = await createCategory({
          name_en,
          name_ar,
        });
      }

      if (result.success) {
        toast({
          title: `Category ${editingCategory ? "updated" : "created"}`,
          description: `The category has been ${editingCategory ? "updated" : "created"} successfully.`,
        });
        onCategoriesUpdate(result.categories);
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const result = await deleteCategory(id);
      if (result.success) {
        toast({
          title: "Category deleted",
          description: "The category has been deleted successfully",
        });
        onCategoriesUpdate(result.categories);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNameEn("");
    setNameAr("");
    setEditingCategory(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Categories</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? "Edit the category details below"
              : "Add a new category to organize your programs"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name_en" className="text-right">
              Name (EN)
            </Label>
            <Input
              id="name_en"
              value={name_en}
              onChange={(e) => setNameEn(e.target.value)}
              className="col-span-3"
              placeholder="Enter English name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name_ar" className="text-right">
              Name (AR)
            </Label>
            <Input
              id="name_ar"
              value={name_ar}
              onChange={(e) => setNameAr(e.target.value)}
              className="col-span-3"
              placeholder="Enter Arabic name"
              dir="rtl"
            />
          </div>
          
          <DialogFooter>
            {editingCategory && (
              <Button
                type="button"
                variant="ghost"
                onClick={resetForm}
              >
                Cancel Edit
              </Button>
            )}
            <Button type="submit">
              {editingCategory ? "Update" : "Create"} Category
            </Button>
          </DialogFooter>
        </form>

        <Separator className="my-4" />

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Existing Categories</h3>
          <ScrollArea className="h-[200px] rounded-md border p-2">
            <div className="space-y-2">
              {categories.map((category) => (
                <Card key={category.id} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{category.name_en}</p>
                    <p className="text-sm text-muted-foreground" dir="rtl">
                      {category.name_ar}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingCategory(category);
                        setNameEn(category.name_en);
                        setNameAr(category.name_ar);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
