import CreateImaegGallery from "@/components/admin/Gallary/CreateImaegGallery";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function CreateImageGa() {
  return (
    <div className="container mx-auto py-10 overflow-y-hidden">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Create New Gallery</h1>
        <Button asChild>
          <Link prefetch passHref href="/admin/ImageGallery">View All Galleries</Link>
        </Button>
      </div>
      <CreateImaegGallery />
    </div>
  );
}

