"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"
import { Complaint } from "@/types/complaint"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { complaintsTableConfig } from "../config"

export function ComplaintActions({ complaint }: { complaint: Complaint }) {
  const router = useRouter()
  const [status, setStatus] = useState(complaint.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: "PENDING" | "IN_REVIEW" | "RESOLVED" | "REJECTED") => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/complaints/${complaint.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      setStatus(newStatus)
      revalidatePath('/admin/complaints')
      router.refresh()
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">
              Complaint {complaint.complaintNumber}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Status:</span>
              <Select
                value={status}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {complaintsTableConfig.statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.print()}
            >
              Print
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/complaints')}
            >
              Back to List
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
