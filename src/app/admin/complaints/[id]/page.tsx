import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import db from '@/app/db/db'
import { ComplaintActions } from './complaint-actions'
import { ComplaintDetails } from './complaint-details'
import { ComplaintNotes } from './complaint-notes'
import { ComplaintAttachments } from './complaint-attachments'
import { Complaint } from '@/types/complaint'

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const complaint = await db.complaint.findUnique({
    where: { id: params.id },
    select: { complaintNumber: true }
  })

  if (!complaint) return { title: 'Complaint Not Found' }

  return {
    title: `Complaint ${complaint.complaintNumber}`,
  }
}

async function getComplaint(id: string) {
  const complaint = await db.complaint.findUnique({
    where: { id },
    include: {
      attachments: true,
      notes: {
        orderBy: { createdAt: 'desc' }
      }
    }
  }) as Complaint | null;

  if (!complaint) notFound();
  return complaint;
}

export default async function ComplaintPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const complaint = await getComplaint(params.id)

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6">
        <ComplaintActions complaint={complaint} />
        
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <ComplaintDetails complaint={complaint} />
              </TabsContent>
              <TabsContent value="notes">
                <ComplaintNotes complaintId={complaint.id} notes={complaint.notes} />
              </TabsContent>
              <TabsContent value="attachments">
                <ComplaintAttachments attachments={complaint.attachments} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
