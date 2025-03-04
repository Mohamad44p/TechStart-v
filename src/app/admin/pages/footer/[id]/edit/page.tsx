import { notFound } from "next/navigation"
import EditFooterForm from "./EditFooterForm"
import db from "@/app/db/db"

export default async function EditFooterPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const footer = await db.footer.findUnique({
    where: { id: params.id },
    include: { partners: true },
  })

  if (!footer) {
    notFound()
  }

  const initialData = {
    ...footer,
    projectPartners: footer.partners
      .filter((p) => p.type === "PROJECT_OF")
      .map((p) => p.imageUrl),
    fundedPartners: footer.partners
      .filter((p) => p.type === "FUNDED_BY")
      .map((p) => p.imageUrl),
    implementedPartners: footer.partners
      .filter((p) => p.type === "IMPLEMENTED_BY")
      .map((p) => p.imageUrl),
  }

  return <EditFooterForm initialData={initialData} footerId={params.id} />
}
