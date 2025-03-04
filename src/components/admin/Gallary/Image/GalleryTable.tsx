'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { deleteGallery } from '@/app/actions/create-gallery';

interface Gallery {
  id: string;
  title_en: string;
  title_ar: string;
  createdAt: string;
  images: { id: string; url: string; title_en: string | null; title_ar: string | null }[];
}

interface GalleryTableProps {
  initialGalleries: Gallery[];
}

export function GalleryTable({ initialGalleries }: GalleryTableProps) {
  const [galleries, setGalleries] = useState<Gallery[]>(initialGalleries);
  const { toast } = useToast();
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gallery?')) {
      try {
        const result = await deleteGallery(id);
        if (result.success) {
          setGalleries(galleries.filter(gallery => gallery.id !== id));
          toast({
            title: "Gallery deleted",
            description: "The gallery has been successfully deleted.",
          });
          router.refresh();
        } else {
          throw new Error(result.error || 'Unknown error occurred');
        }
      } catch (error) {
        console.error('Error deleting gallery:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete the gallery. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/ImageGallery/edit/${id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title (EN/AR)</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Preview</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {galleries.map((gallery) => (
          <TableRow key={gallery.id}>
            <TableCell className="font-medium">
              {gallery.title_en} / {gallery.title_ar}
            </TableCell>
            <TableCell>{formatDate(gallery.createdAt)}</TableCell>
            <TableCell>
              <div className="flex space-x-2 overflow-x-auto">
                {gallery.images.slice(0, 3).map((image) => (
                  <div key={image.id} className="relative w-12 h-12">
                    <Image
                      src={image.url}
                      alt={`Preview of ${image.title_en || gallery.title_en}`}
                       fill
                      className="rounded object-cover"
                    />
                  </div>
                ))}
                {gallery.images.length > 3 && (
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded">
                    +{gallery.images.length - 3}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(gallery.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(gallery.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

