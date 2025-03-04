"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroStepFormClient } from "./HeroStepFormClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroStep, HeroStepInput } from "@/types/hero";

type HeroStepListClientProps = {
  initialSteps: HeroStep[];
  onUpdate: (id: number, data: HeroStepInput) => Promise<HeroStep>;
  onDelete: (id: number) => Promise<void>;
  onCreate: (data: HeroStepInput) => Promise<HeroStep>;
  isProcessing?: boolean;
};

export function HeroStepListClient({
  initialSteps = [],
  onUpdate,
  onDelete,
  onCreate,
}: HeroStepListClientProps) {
  const [steps, setSteps] = useState<HeroStep[]>(initialSteps);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleUpdate = async (id: number, data: HeroStepInput) => {
    try {
      const updatedStep = await onUpdate(id, data);
      setSteps(steps.map((step) => (step.id === id ? updatedStep : step)));
      setEditingId(null);
      toast({
        title: "Success",
        description: "Hero step updated successfully",
      });
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update hero step. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await onDelete(id);
      setSteps(steps.filter((step) => step.id !== id));
      toast({
        title: "Success",
        description: "Hero step deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete hero step. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async (data: HeroStepInput) => {
    try {
      const newStep = await onCreate(data);
      setSteps([...steps, newStep]);
      setIsCreating(false);
      toast({
        title: "Success",
        description: "New hero step created successfully",
      });
    } catch (error) {
      console.error("Create error:", error);
      toast({
        title: "Error",
        description: "Failed to create new hero step. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Hero Step</CardTitle>
          </CardHeader>
          <CardContent>
            <HeroStepFormClient onSubmit={handleCreate} />
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsCreating(true)}>
          Create New Hero Step
        </Button>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.id}>
            <CardHeader>
              <CardTitle>
                <Tabs defaultValue="english" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="english">EN</TabsTrigger>
                    <TabsTrigger value="arabic">AR</TabsTrigger>
                  </TabsList>
                  <TabsContent value="english">
                    {step.title_en}
                  </TabsContent>
                  <TabsContent value="arabic" className="text-right" dir="rtl">
                    {step.title_ar}
                  </TabsContent>
                </Tabs>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {step.tagline_en}
              </p>
              {editingId === step.id ? (
                <HeroStepFormClient
                  initialData={step}
                  onSubmit={(data: HeroStepInput) => handleUpdate(step.id, data)}
                />
              ) : (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: step.color }}
                    />
                    <span>Color: {step.color}</span>
                  </div>
                  <p className="text-sm mb-4">Order: {step.order}</p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(step.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(step.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
