import { NextResponse } from 'next/server';
import { ComplaintType, AttachmentData } from '@/types/complaint';
import db from '@/app/db/db';
import { sendComplaintNotification } from '@/utils/email';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (!data.type || !['REGULAR', 'ANONYMOUS'].includes(data.type) ||
        !data.complaintDescription?.description ||
        !data.complaintDescription?.entity ||
        !data.complaintDetails?.facts ||
        !data.confirmed) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['REGULAR', 'ANONYMOUS'].includes(data.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid complaint type' },
        { status: 400 }
      );
    }

    const complaintNumber = `COMP-${Date.now()}`;
    const baseComplaintData = {
      type: data.type as ComplaintType,
      complaintNumber,
      description: data.complaintDescription.description,
      entityAgainst: data.complaintDescription.entity,
      filedInCourt: data.complaintDescription.filedInCourt,
      hasPreviousComplaint: data.previousComplaints.hasPreviousComplaint,
      previousComplaintEntity: data.previousComplaints.previousComplaintEntity,
      previousComplaintDate: data.previousComplaints.previousComplaintDate 
        ? new Date(data.previousComplaints.previousComplaintDate) 
        : null,
      facts: data.complaintDetails.facts,
      confirmed: data.confirmed,
      attachments: {
        createMany: {
          data: (data.attachments as AttachmentData[]).map(att => ({
            fileUrl: att.fileUrl,
            fileName: att.fileName,
            fileType: att.fileType,
            fileSize: att.fileSize
          }))
        }
      }
    };

    let complaintData;

    // Add fields based on complaint type
    if (data.type === 'REGULAR') {
      complaintData = {
        ...baseComplaintData,
        complainantType: data.complainantInfo?.complainantType,
        complainantName: data.complainantInfo?.name,
        complainantGender: data.complainantInfo?.gender,
        complainantEmail: data.complainantInfo?.email,
        complainantPhone: data.complainantInfo?.phone,
        firmName: data.complainantInfo?.firmName,
        firmEmail: data.complainantInfo?.firmEmail,
        firmPhone: data.complainantInfo?.firmPhone,
      };
    } else {
      // For anonymous complaints with optional contact info
      complaintData = {
        ...baseComplaintData,
        // Add contact info if provided for anonymous complaints
        ...(data.contactInfo && {
          complainantEmail: data.contactInfo.email || null,
          complainantPhone: data.contactInfo.phone || null
        })
      };
    }

    const complaint = await db.complaint.create({
      data: complaintData
    });

    // Send email notification to admins
    try {
      await sendComplaintNotification({
        complaintNumber: complaint.complaintNumber,
        type: complaint.type,
        details: {
          ...complaintData,
          description: data.complaintDescription.description,
          entityAgainst: data.complaintDescription.entity,
          filedInCourt: data.complaintDescription.filedInCourt,
          hasPreviousComplaint: data.previousComplaints.hasPreviousComplaint,
          previousComplaintEntity: data.previousComplaints.previousComplaintEntity,
          previousComplaintDate: data.previousComplaints.previousComplaintDate,
          facts: data.complaintDetails.facts,
        }
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Continue even if email fails, we've already saved the complaint to DB
    }

    return NextResponse.json({
      success: true,
      complaintNumber: complaint.complaintNumber
    });
  } catch (error) {
    console.error('Complaint submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit complaint' },
      { status: 500 }
    );
  }
}
