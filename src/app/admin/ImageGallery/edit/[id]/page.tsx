import { Suspense } from 'react';
import EditImageGallery from '@/components/admin/Gallary/EditImageGallery';
import db from '@/app/db/db';

async function getGallery(id: string) {
  const gallery = await db.gallery.findUnique({
    where: { id },
    include: { images: true },
  });
  
  if (!gallery) return null;

  return {
    ...gallery,
    createdAt: gallery.createdAt.toISOString(),
  };
}

export default async function EditGalleryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const gallery = await getGallery(params.id);

  if (!gallery) {
    return <div>Gallery not found</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditImageGallery gallery={gallery} />
    </Suspense>
  );
}

