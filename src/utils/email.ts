import nodemailer from 'nodemailer';

// Configure nodemailer transporter
// For production, use actual SMTP credentials
// For development, you can use services like Mailtrap, SendGrid, or Gmail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
});

// Admin email addresses that will receive notifications
const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@techstart.org'];

export interface EmailData {
  from?: string;
  to: string | string[];
  subject: string;
  text?: string;
  html: string;
}

/**
 * Sends an email using nodemailer
 */
export async function sendEmail(emailData: EmailData) {
  try {
    const { from, to, subject, text, html } = emailData;
    
    const mailOptions = {
      from: from || `"TechStart" <${process.env.EMAIL_FROM || 'noreply@techstart.org'}>`,
      to,
      subject,
      text: text || '',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Sends a notification to admins about a new contact form submission
 */
export async function sendContactFormNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  id: string;
}) {
  const { name, email, subject, message, id } = data;
  
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>ID:</strong> ${id}</p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <h3>Message:</h3>
    <p>${message.replace(/\n/g, '<br>')}</p>
    <p>Please log in to the admin panel to view and respond to this message.</p>
  `;

  return sendEmail({
    to: adminEmails,
    subject: `New Contact Form: ${subject}`,
    html,
  });
}

// Define an interface for complaint details to avoid using 'any'
export interface ComplaintDetails {
  complainantType?: string;
  complainantName?: string;
  complainantGender?: string;
  complainantEmail?: string;
  complainantPhone?: string;
  firmName?: string;
  firmEmail?: string;
  firmPhone?: string;
  description: string;
  entityAgainst: string;
  filedInCourt: boolean;
  hasPreviousComplaint: boolean;
  previousComplaintEntity?: string;
  previousComplaintDate?: string | Date | null;
  facts: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Sends a notification to admins about a new complaint submission
 */
export async function sendComplaintNotification(data: {
  complaintNumber: string;
  type: string;
  details: ComplaintDetails;
}) {
  const { complaintNumber, type, details } = data;
  
  // Prepare email content based on complaint type
  let complainantInfo = '';
  if (type === 'REGULAR') {
    complainantInfo = `
      <p><strong>Complainant Type:</strong> ${details.complainantType || 'N/A'}</p>
      <p><strong>Name:</strong> ${details.complainantName || 'N/A'}</p>
      <p><strong>Email:</strong> ${details.complainantEmail || 'N/A'}</p>
      <p><strong>Phone:</strong> ${details.complainantPhone || 'N/A'}</p>
    `;
    if (details.complainantType === 'ORGANIZATION') {
      complainantInfo += `
        <p><strong>Firm Name:</strong> ${details.firmName || 'N/A'}</p>
        <p><strong>Firm Email:</strong> ${details.firmEmail || 'N/A'}</p>
        <p><strong>Firm Phone:</strong> ${details.firmPhone || 'N/A'}</p>
      `;
    }
  } else {
    // Anonymous complaint
    complainantInfo = `
      <p><strong>Type:</strong> Anonymous Complaint</p>
      <p><strong>Contact Provided:</strong> ${details.complainantEmail || details.complainantPhone ? 'Yes' : 'No'}</p>
    `;
    if (details.complainantEmail || details.complainantPhone) {
      complainantInfo += `
        <p><strong>Email:</strong> ${details.complainantEmail || 'N/A'}</p>
        <p><strong>Phone:</strong> ${details.complainantPhone || 'N/A'}</p>
      `;
    }
  }

  const html = `
    <h2>New Complaint Submission</h2>
    <p><strong>Complaint Number:</strong> ${complaintNumber}</p>
    <p><strong>Type:</strong> ${type}</p>
    
    <h3>Complainant Information:</h3>
    ${complainantInfo}
    
    <h3>Complaint Details:</h3>
    <p><strong>Entity Against:</strong> ${details.entityAgainst}</p>
    <p><strong>Filed In Court:</strong> ${details.filedInCourt ? 'Yes' : 'No'}</p>
    <p><strong>Description:</strong> ${details.description.replace(/\n/g, '<br>')}</p>
    
    <p><strong>Has Previous Complaints:</strong> ${details.hasPreviousComplaint ? 'Yes' : 'No'}</p>
    ${details.hasPreviousComplaint ? `
      <p><strong>Previous Entity:</strong> ${details.previousComplaintEntity || 'N/A'}</p>
      <p><strong>Previous Date:</strong> ${details.previousComplaintDate || 'N/A'}</p>
    ` : ''}
    
    <h3>Detailed Facts and Grounds:</h3>
    <p>${details.facts.replace(/\n/g, '<br>')}</p>
    
    <p>Please log in to the admin panel to view and process this complaint.</p>
  `;

  return sendEmail({
    to: adminEmails,
    subject: `New Complaint Submission: ${complaintNumber}`,
    html,
  });
} 