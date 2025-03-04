import { TeamMemberForm } from "@/components/admin/team/team-member-form"

export default function CreateTeamMemberPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Team Member</h1>
      <TeamMemberForm />
    </div>
  )
}

