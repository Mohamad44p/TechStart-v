import { use } from 'react';
import EditVideoGalleryForm from '@/components/admin/Gallary/EditVideoGalleryForm';

export default function EditVideoGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <EditVideoGalleryForm id={resolvedParams.id} />;
}
