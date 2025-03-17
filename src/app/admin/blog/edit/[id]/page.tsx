import { Suspense } from 'react'
import EditBlogForm from './EditBlogForm'
import db from '@/app/db/db'

async function fetchBlogById(id: number) {
  const blog = await db.post.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  })

  if (!blog) return null;

  return {
    ...blog,
    content_en: blog.content_en || "",
    content_ar: blog.content_ar || "",
    description_en: blog.description_en || "",
    description_ar: blog.description_ar || "",
    imageUrl: blog.imageUrl || "",
    pdfUrl: blog.pdfUrl || ""
  }
}
  

export default async function EditBlog(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = parseInt(params.id, 10)
  const blog = await fetchBlogById(id)

  if (!blog) {
    return <div>News & Press Release not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit News & Press Release</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <EditBlogForm blog={blog} />
      </Suspense>
    </div>
  )
}

