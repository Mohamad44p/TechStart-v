"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Complaint } from "@/types/complaint"
import { formatDate } from "@/lib/utils"
import { AlertCircle, Mail, Phone, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ComplaintDetails({ complaint }: { complaint: Complaint }) {
  const isAnonymous = complaint.type === "ANONYMOUS"
  const hasAnonymousContact = isAnonymous && (complaint.complainantEmail || complaint.complainantPhone)

  return (
    <div className="space-y-6 pt-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-2">Complaint Information</h3>
              <p className="text-sm text-muted-foreground">
                Submitted on {formatDate(complaint.submittedAt)}
              </p>
            </div>
            <Badge variant={isAnonymous ? "outline" : "default"} className="ml-2">
              {isAnonymous ? "Anonymous" : "Regular"}
            </Badge>
          </div>
          
          {hasAnonymousContact && (
            <Alert className="mt-4 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Anonymous Contact Information</AlertTitle>
              <AlertDescription className="text-amber-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {complaint.complainantEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-amber-600" />
                      <span>Email: </span>
                      <a href={`mailto:${complaint.complainantEmail}`} className="text-blue-600 hover:underline">
                        {complaint.complainantEmail}
                      </a>
                    </div>
                  )}
                  {complaint.complainantPhone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-amber-600" />
                      <span>Phone: </span>
                      <a href={`tel:${complaint.complainantPhone}`} className="text-blue-600 hover:underline">
                        {complaint.complainantPhone}
                      </a>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Separator className="my-6" />

          {!isAnonymous && (
            <>
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5" /> Complainant Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p>{complaint.complainantName || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="capitalize">{complaint.complainantType?.toLowerCase() || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{complaint.complainantEmail || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{complaint.complainantPhone || "Not provided"}</p>
                  </div>
                  {complaint.complainantType === "ORGANIZATION" && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Organization</p>
                        <p>{complaint.firmName || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Organization Email</p>
                        <p>{complaint.firmEmail || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Organization Phone</p>
                        <p>{complaint.firmPhone || "Not provided"}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <Separator className="my-6" />
            </>
          )}

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Complaint Description</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="whitespace-pre-line">{complaint.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Entity Against</p>
                <p>{complaint.entityAgainst}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Filed in Court</p>
                <p>{complaint.filedInCourt ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Previous Complaints</h4>
            {complaint.hasPreviousComplaint ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Previous Entity</p>
                  <p>{complaint.previousComplaintEntity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Filing Date</p>
                  <p>
                    {complaint.previousComplaintDate ? formatDate(complaint.previousComplaintDate) : "Not provided"}
                  </p>
                </div>
              </div>
            ) : (
              <p>No previous complaints filed</p>
            )}
          </div>

          <Separator className="my-6" />

          <div>
            <h4 className="text-lg font-semibold mb-4">Facts and Grounds</h4>
            <p className="whitespace-pre-line">{complaint.facts}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
