'use client'

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface DataActionsProps {
  editHref: string
  deleteAction: (id: string) => Promise<void>
  deleteModalTitle: string
  deleteModalDescription: string
  itemId: string
}

export function DataActions({
  editHref,
  deleteAction,
  deleteModalTitle,
  deleteModalDescription,
  itemId
}: DataActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await deleteAction(itemId)
      toast({ title: "Deleted successfully" })
      router.refresh()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Something went wrong", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={editHref}>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={isLoading}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteModalTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteModalDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
