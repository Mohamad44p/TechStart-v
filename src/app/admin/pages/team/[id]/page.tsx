import { getTeamMemberById } from "@/app/actions/pages/team-actions"
import { TeamMemberForm } from "@/components/admin/team/team-member-form"
import { notFound } from "next/navigation"

export default async function EditTeamMemberPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const teamMember = await getTeamMemberById(params.id)

  if (!teamMember) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Team Member</h1>
      <TeamMemberForm initialData={teamMember} />
    </div>
  )
}

