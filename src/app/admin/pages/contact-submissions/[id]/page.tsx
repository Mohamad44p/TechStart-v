import { getContactSubmission } from "@/app/actions/pages/contact-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ContactSubmissionDetail(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const submission = await getContactSubmission(params.id)

  if (!submission) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-6">
        <Link prefetch passHref href="/admin/pages/contact-submissions">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Contact Submission Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <span className={`inline-flex px-2 py-1 rounded-full text-sm mr-4 ${
              submission.status === 'new' ? 'bg-blue-100 text-blue-800' :
              submission.status === 'read' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {submission.status}
            </span>
            {submission.subject}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Submitted on {formatDate(submission.createdAt)}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Name</h3>
              <p>{submission.name}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Email</h3>
              <p>{submission.email}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Message</h3>
            <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
              {submission.message}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
