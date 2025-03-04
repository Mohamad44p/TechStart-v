import { getStat } from "@/app/actions/pages/statActions"
import { StatFormUnified } from "@/components/admin/pages/StatFormUnified"
import { notFound } from "next/navigation"

export default async function EditStatPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const response = await getStat(params.id)

  if (!response.success) {
    notFound()
  }

  return <StatFormUnified mode="edit" stat={response.data} />
}
