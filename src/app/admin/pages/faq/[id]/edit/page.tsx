import { notFound } from 'next/navigation'
import { getFaqCategoryById } from '@/app/actions/pages/faqActions'
import { FaqCategoryForm } from '@/components/admin/faq/faq-category-form'

export default async function EditFaqCategoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const category = await getFaqCategoryById(params.id)

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit FAQ Category</h1>
      <FaqCategoryForm initialData={category} />
    </div>
  )
}