import { getPrograms } from "@/app/actions/program-page-actions";
import { FaqCategoryForm } from "@/components/admin/faq/faq-category-form";

export default async function CreateFaqCategoryPage() {
  const { programs = [] } = await getPrograms();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create FAQ Category</h1>
      <FaqCategoryForm programs={programs} />
    </div>
  );
}
