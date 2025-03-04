import { getContactSubmissions } from "@/app/actions/pages/contact-actions"
import { columns } from "./columns"
import { DataTable } from "@/components/admin/Gallary/tabel/data-table"

const tableConfig = {
  statusOptions: [
    { value: "new", label: "New" },
    { value: "read", label: "Read" },
    { value: "archived", label: "Archived" }
  ],
  defaultPageSize: 10,
  statusColors: {
    new: "bg-blue-100 text-blue-800",
    read: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800"
  }
};


export const dynamic = "force-dynamic"


export default async function ContactSubmissionsPage() {
  const submissions = await getContactSubmissions()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Form Submissions</h1>
      <DataTable 
        columns={columns} 
        data={submissions} 
        config={tableConfig}
      />
    </div>
  )
}

