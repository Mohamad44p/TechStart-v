import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { GalleryTable } from '@/components/admin/Gallary/Image/GalleryTable';
import db from '@/app/db/db';

async function fetchGalleries() {
  const galleries = await db.gallery.findMany({
    include: {
      images: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return galleries.map(gallery => ({
    ...gallery,
    createdAt: gallery.createdAt.toISOString(),
  }));
}

export default async function AllImagesGa() {
  const galleries = await fetchGalleries();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Image Galleries</h1>
      <Suspense fallback={<Skeleton className="w-full h-96" />}>
        <GalleryTable initialGalleries={galleries} />
      </Suspense>
    </div>
  );
}

