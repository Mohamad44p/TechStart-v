import { notFound } from 'next/navigation'
import { getFaqItemById } from '@/app/actions/pages/faqActions'
import { FaqItemForm } from '@/components/admin/faq/faq-item-form'

export default async function EditFaqItemPage(props: { params: Promise<{ id: string; itemId: string }> }) {
  const params = await props.params;
  const item = await getFaqItemById(params.itemId)

  if (!item) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit FAQ Question</h1>
      <FaqItemForm categoryId={params.id} initialData={item} />
    </div>
  )
}