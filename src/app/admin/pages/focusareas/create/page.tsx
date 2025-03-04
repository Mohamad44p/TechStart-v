import { FocusareaForm } from "@/components/admin/focusareas/focusarea-form";

export default function CreateFocusareaPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Focus Area</h1>
      <FocusareaForm />
    </div>
  );
}
