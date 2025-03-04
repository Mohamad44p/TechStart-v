import { getFocusareaById } from "@/app/actions/pages/focusareas-actions";
import { FocusareaForm } from "@/components/admin/focusareas/focusarea-form";
import { transformFocusareaData } from "../utils";
import { notFound } from "next/navigation";

export default async function EditFocusareaPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const focusareaData = await getFocusareaById(params.id);

  if (!focusareaData) {
    notFound();
  }

  // Transform the data to match the form's expected structure
  const focusarea = transformFocusareaData(focusareaData);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Focus Area</h1>
      <FocusareaForm initialData={focusarea} />
    </div>
  );
} 