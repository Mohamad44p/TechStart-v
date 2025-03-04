'use client'

import { HeroStepListClient } from "./HeroStepListClient"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { ApiResponse, HeroStep, HeroStepInput } from '@/types/hero'
import { createHeroStep, updateHeroStep, deleteHeroStep } from '@/app/actions/pages/hero'

export function HeroPageClient({ initialSteps }: { initialSteps: HeroStep[] }) {
  const [steps, setSteps] = useState<HeroStep[]>(initialSteps)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCreate = async (data: HeroStepInput): Promise<HeroStep> => {
    setIsProcessing(true)
    try {
      const result = await createHeroStep(data)
      
      if (!result.success || !result.data) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Failed to create hero step')
      }
      
      setSteps(prev => [...prev, result.data!])
      return result.data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create hero step'
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpdate = async (id: number, data: HeroStepInput) => {
    setIsProcessing(true)
    try {
      const result = await updateHeroStep(id, data)
      
      if (!result.success) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Failed to update hero step')
      }
      
      setSteps(steps.map(step => step.id === id ? result.data! : step))
      return result.data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hero step",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsProcessing(true)
    try {
      const result = await deleteHeroStep(id)
      
      if (!result.success) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Failed to delete hero step')
      }
      
      setSteps(steps.filter(step => step.id !== id))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hero step",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <HeroStepListClient
      initialSteps={steps}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onCreate={handleCreate}
      isProcessing={isProcessing}
    />
  )
}
