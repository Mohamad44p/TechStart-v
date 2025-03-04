'use server'

import db from '@/app/db/db'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'
import { type HeroStep, type HeroStepInput, heroStepSchema, type ApiResponse } from '@/types/hero'
import { z } from 'zod'
import { formatDatabaseError, safeDbOperation } from '@/lib/db-utils'

export async function createHeroStep(data: HeroStepInput): Promise<ApiResponse<HeroStep>> {
  try {
    const validated = heroStepSchema.parse(data)
    
    const result = await safeDbOperation(
      () => db.heroStep.create({
        data: validated
      }),
      'Failed to create hero step'
    );
    
    if (result.error) {
      return { success: false, error: result.error };
    }

    revalidatePath('/admin/pages/hero')
    return { success: true, data: result.data! }
  } catch (error) {
    console.error('Error creating hero step:', error)
    return {
      success: false,
      error: error instanceof z.ZodError
        ? error.errors.map(e => e.message).join(', ')
        : formatDatabaseError(error, 'Failed to create hero step')
    }
  }
}

export async function updateHeroStep(id: number, data: HeroStepInput): Promise<ApiResponse<HeroStep>> {
  try {
    const validated = heroStepSchema.parse(data)
    
    const txResult = await safeDbOperation(
      async () => {
        return await db.$transaction(async (tx) => {
          const currentStep = await tx.heroStep.findUnique({
            where: { id }
          })

          if (!currentStep) {
            throw new Error('Hero step not found')
          }

          if (currentStep.order !== validated.order) {
            await handleReordering(tx, currentStep.order, validated.order, id)
          }

          const updatedStep = await tx.heroStep.update({
            where: { id },
            data: validated
          })

          return updatedStep;
        });
      },
      'Failed to update hero step'
    );
    
    if (txResult.error) {
      return { success: false, error: txResult.error };
    }

    revalidatePath('/admin/hero')
    return { success: true, data: txResult.data! }
  } catch (error) {
    console.error('Error updating hero step:', error)
    return {
      success: false,
      error: error instanceof z.ZodError
        ? error.errors.map(e => e.message).join(', ')
        : formatDatabaseError(error, 'Failed to update hero step')
    }
  }
}

export async function deleteHeroStep(id: number): Promise<ApiResponse<void>> {
  try {
    const txResult = await safeDbOperation(
      async () => {
        return await db.$transaction(async (tx) => {
          const step = await tx.heroStep.delete({ where: { id } })
          await tx.heroStep.updateMany({
            where: { order: { gt: step.order } },
            data: { order: { decrement: 1 } }
          })
        });
      },
      'Failed to delete hero step'
    );
    
    if (txResult.error) {
      return { success: false, error: txResult.error };
    }
    
    revalidatePath('/admin/pages/hero')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error deleting hero step:', error)
    return { 
      success: false, 
      error: formatDatabaseError(error, 'Failed to delete hero step')
    }
  }
}

export const getHeroSteps = cache(async (): Promise<ApiResponse<HeroStep[]>> => {
  try {
    const result = await safeDbOperation(
      () => db.heroStep.findMany({
        orderBy: { order: 'asc' }
      }),
      'Failed to fetch hero steps'
    );
    
    if (result.error) {
      return { success: false, error: result.error };
    }
    
    return { 
      success: true, 
      data: result.data! 
    }
  } catch (error) {
    console.error('Error fetching hero steps:', error)
    return { 
      success: false, 
      error: formatDatabaseError(error, 'Failed to fetch hero steps')
    }
  }
})

async function handleReordering(tx: Parameters<Parameters<typeof db.$transaction>[0]>[0], oldOrder: number, newOrder: number, stepId: number) {
  if (newOrder > oldOrder) {
    await tx.heroStep.updateMany({
      where: {
        order: { gt: oldOrder, lte: newOrder },
        id: { not: stepId }
      },
      data: { order: { decrement: 1 } }
    })
  } else {
    await tx.heroStep.updateMany({
      where: {
        order: { gte: newOrder, lt: oldOrder },
        id: { not: stepId }
      },
      data: { order: { increment: 1 } }
    })
  }
}

