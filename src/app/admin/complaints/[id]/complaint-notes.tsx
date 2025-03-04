"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ComplaintNote } from "@/types/complaint"

export function ComplaintNotes({ complaintId, notes }: { complaintId: string, notes: ComplaintNote[] }) {
  const router = useRouter()
  const [newNote, setNewNote] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim() || !authorName.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/complaints/${complaintId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNote,
          authorName: authorName,
        }),
      })

      if (!response.ok) throw new Error('Failed to add note')

      setNewNote("")
      setAuthorName("")
      router.refresh()
    } catch (error) {
      console.error('Error adding note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          disabled={isSubmitting}
        />
        <Textarea
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={isSubmitting}
        />
        <Button 
          onClick={handleAddNote}
          disabled={isSubmitting || !newNote.trim() || !authorName.trim()}
        >
          {isSubmitting ? 'Adding...' : 'Add Note'}
        </Button>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{note.authorName}</p>
              </div>
              <p className="text-sm text-gray-500">{formatDate(note.createdAt)}</p>
            </div>
            <p className="text-gray-700">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
