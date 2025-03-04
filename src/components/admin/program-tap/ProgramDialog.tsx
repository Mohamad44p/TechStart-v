/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { ProgramsPages, ProgramCategory } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import {
  createProgram,
  updateProgram,
  createCategory,
  getCategories,
  deleteProgram,
} from "@/app/actions/program-actions";
import { CategoryDialog } from "./CategoryDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";

interface ProgramDialogProps {
  programs: ProgramsPages[];
  onProgramsUpdate: (updatedPrograms: ProgramsPages[]) => void;
}

export function ProgramDialog({ programs, onProgramsUpdate }: ProgramDialogProps) {
  const [open, setOpen] = useState(false);
  const [name_en, setNameEn] = useState("");
  const [name_ar, setNameAr] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [newCategoryEn, setNewCategoryEn] = useState("");
  const [newCategoryAr, setNewCategoryAr] = useState("");
  const [categories, setCategories] = useState<Omit<ProgramCategory, 'programs'>[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramsPages | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const result = await getCategories();
    if (result.success && result.categories) {
      setCategories(result.categories);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryEn || !newCategoryAr) {
      toast({
        title: "Error",
        description: "Please fill in both English and Arabic names for the category",
        variant: "destructive",
      });
      return;
    }

    const result = await createCategory({
      name_en: newCategoryEn,
      name_ar: newCategoryAr,
    });

    if (result.success && result.newCategory) {
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });
      setCategories(result.categories || []);
      setNewCategoryEn("");
      setNewCategoryAr("");
      setShowNewCategory(false);
      setCategoryId(result.newCategory.id);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (editingProgram) {
        result = await updateProgram({
          id: editingProgram.id,
          name_en,
          name_ar,
          categoryId,
        });
      } else {
        result = await createProgram({ 
          name_en, 
          name_ar, 
          categoryId 
        });
      }

      if (result.success) {
        toast({
          title: `Program ${editingProgram ? "updated" : "created"}`,
          description: `The program has been ${editingProgram ? "updated" : "created"} successfully.`,
        });
        onProgramsUpdate(result.programs);
        setOpen(false);
        resetForm();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        const result = await deleteProgram(id);
        if (result.success) {
          toast({
            title: "Program deleted",
            description: "The program has been deleted successfully.",
          });
          onProgramsUpdate(result.programs);
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setNameEn("");
    setNameAr("");
    setCategoryId("");
    setEditingProgram(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex space-x-2">
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Manage Programs
          </Button>
        </DialogTrigger>
        <CategoryDialog 
          categories={categories} 
          onCategoriesUpdate={setCategories} 
        />
      </div>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingProgram ? "Edit Program" : "Create Program"}
          </DialogTitle>
          <DialogDescription>
            {editingProgram
              ? "Edit the program details below"
              : "Add a new program to the system"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_en} ({category.name_ar})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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
          </div>
          
          <DialogFooter>
            {editingProgram && (
              <Button
                type="button"
                variant="ghost"
                onClick={resetForm}
              >
                Cancel Edit
              </Button>
            )}
            <Button type="submit">
              {editingProgram ? "Update" : "Create"} Program
            </Button>
          </DialogFooter>
        </form>

        {programs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Existing Programs</h3>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {programs.map((program) => (
                  <Card key={program.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{program.name_en}</h4>
                        <p className="text-sm text-muted-foreground" dir="rtl">
                          {program.name_ar}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Category: {categories.find(c => c.id === program.categoryId)?.name_en || 'None'}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingProgram(program);
                            setNameEn(program.name_en);
                            setNameAr(program.name_ar);
                            setCategoryId(program.categoryId || "");
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(program.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
