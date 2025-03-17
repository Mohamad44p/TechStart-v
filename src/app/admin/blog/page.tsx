import db from "@/app/db/db";
import DisplayBlogs from "@/components/admin/Blog/DisplayBlogs";
import { Suspense } from "react";
async function fetchBlogs() {
  const blogs = await db.post.findMany({
    include: {
      tags: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return blogs.map(blog => ({
    ...blog,
    content_en: blog.content_en || "",
    content_ar: blog.content_ar || "",
    description_en: blog.description_en || "",
    description_ar: blog.description_ar || "",
    imageUrl: blog.imageUrl || "",
    pdfUrl: blog.pdfUrl || ""
  }));
}

export default async function Blogs() {
  const blogs = await fetchBlogs();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">News & Press Releases</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DisplayBlogs initialBlogs={blogs} />
      </Suspense>
    </div>
  );
}
