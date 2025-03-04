export interface AnonymousComplaint {
  id: string;
  date: Date;
  willProvideContact: boolean;
  description: string;
  entityAgainst: string;
  filedInCourt: boolean;
  previousComplaint: boolean;
  previousEntityAgainst?: string;
  previousFilingDate?: Date;
  receivedResponse?: boolean;
  responseDate?: Date;
  factsAndGrounds: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ComplaintType = "REGULAR" | "ANONYMOUS";
export type ComplaintStatus = "PENDING" | "IN_REVIEW" | "RESOLVED" | "REJECTED";

export interface ComplaintAttachment {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface ComplaintNote {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  complaintId: string;
}

export interface Complaint {
  id: string;
  type: ComplaintType;
  complaintNumber: string;
  submittedAt: Date;
  status: "PENDING" | "IN_REVIEW" | "RESOLVED" | "REJECTED";

  // Regular complaint fields
  complainantType?: "INDIVIDUAL" | "ORGANIZATION";
  complainantName?: string;
  complainantGender?: string;

  // Contact info - used for both regular and anonymous (when provided)
  complainantEmail?: string;
  complainantPhone?: string;

  // Organization fields
  firmName?: string;
  firmEmail?: string;
  firmPhone?: string;

  // Complaint details
  description: string;
  entityAgainst: string;
  filedInCourt: boolean;

  // Previous complaints
  hasPreviousComplaint: boolean;
  previousComplaintEntity?: string;
  previousComplaintDate?: Date;

  // Additional details
  facts: string;
  confirmed: boolean;

  // Handling info
  assignedToName?: string;
  assignedToEmail?: string;
  updatedAt?: Date;

  // Related records
  attachments: ComplaintAttachment[];
  notes: ComplaintNote[];
}

export interface ComplainantData {
  complainantType: "INDIVIDUAL" | "ORGANIZATION";
  name?: string;
  gender?: string;
  phone?: string;
  email?: string;
  firmName?: string;
  firmPhone?: string;
  firmEmail?: string;
}

export interface ComplaintDescriptionData {
  description: string;
  entity: string;
  filedInCourt: boolean;
}

export interface PreviousComplaintData {
  hasPreviousComplaint: boolean;
  previousComplaintEntity?: string;
  previousComplaintDate?: string;
  receivedResponse?: boolean;
  responseDate?: string;
}

export interface ComplaintDetailsData {
  facts: string;
}

export interface AttachmentData {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface ComplaintFormData {
  type?: ComplaintType; 
  complainantInfo?: {
    complainantType: "INDIVIDUAL" | "ORGANIZATION";
    name: string;
    gender?: string;
    email: string;
    phone: string;
    firmName?: string;
    firmEmail?: string;
    firmPhone?: string;
  };
  complaintDescription: {
    description: string;
    entity: string;
    filedInCourt: boolean;
  };
  previousComplaints: {
    hasPreviousComplaint: boolean;
    previousComplaintEntity?: string;
    previousComplaintDate?: string;
    receivedResponse?: boolean;
    responseDate?: string;
  };
  complaintDetails: {
    facts: string;
  };
  attachments: AttachmentData[];
  confirmed: boolean;
}

// Add initial state constant
export const initialFormData: ComplaintFormData = {
  type: "REGULAR",
  complainantInfo: undefined,
  complaintDescription: {
    description: "",
    entity: "",
    filedInCourt: false,
  },
  previousComplaints: {
    hasPreviousComplaint: false,
    previousComplaintEntity: "",
    previousComplaintDate: "",
    receivedResponse: false,
    responseDate: "",
  },
  complaintDetails: {
    facts: "",
  },
  attachments: [],
  confirmed: false,
};

