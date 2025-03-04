'use client'

import { useState } from 'react'
import { HeroStepFormClient } from '@/components/admin/pages/HeroStepFormClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { HeroStepInput } from '@/types/hero'
import { createHeroStep } from '@/app/actions/pages/hero'

export default function CreateHeroStepPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: HeroStepInput) => {
    setIsSubmitting(true)
    try {
      const result = await createHeroStep(data)
      
      if (!result.success) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Failed to create hero step')
      }
      
      toast({
        title: 'Success',
        description: 'Hero step created successfully',
      })
      
      router.push('/admin/pages/home')
    } catch (error) {
      console.error('Error creating hero step:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create hero step',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.push('/admin/pages/home')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Hero Steps
        </Button>
        <h1 className="text-3xl font-bold">Create New Hero Step</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Hero Step Details</CardTitle>
        </CardHeader>
        <CardContent>
          <HeroStepFormClient 
            onSubmit={handleSubmit} 
            isProcessing={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
} 