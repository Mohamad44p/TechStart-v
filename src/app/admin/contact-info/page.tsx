import { getContactInfo } from "@/app/actions/pages/contactActions";
import { ContactInfoForm } from "@/components/admin/contact-info/contact-info-form";

//contact info page

export default async function ContactInfoPage() {
  const { data: contactInfo, error } = await getContactInfo();

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Contact Information</h1>
      <ContactInfoForm initialData={contactInfo} />
    </div>
  );
} 