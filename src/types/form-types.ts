export interface ComplainantData {
  complainantType: "individual" | "firm"
  name?: string
  gender?: string
  email?: string
  phone?: string
  firmName?: string
  firmEmail?: string
  firmPhone?: string
}

export interface ComplaintDescriptionData {
  description: string
  entity: string
  filedInCourt: boolean
}

export interface PreviousComplaintsData {
  hasPreviousComplaint: boolean
  previousComplaintEntity?: string
  previousComplaintDate?: string
  receivedResponse?: boolean
  responseDate?: string
}

export interface ComplaintDetailsData {
  facts: string
}

export interface AttachmentData {
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
}

export interface FormDataType {
  complainantInfo?: ComplainantData
  complaintDescription?: ComplaintDescriptionData
  previousComplaints?: PreviousComplaintsData
  complaintDetails?: ComplaintDetailsData
  attachments?: AttachmentData[]
  confirmed?: boolean
}

