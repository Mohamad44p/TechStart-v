"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { formatDate } from "@/lib/utils";
import { deletePost } from "@/app/actions/delete-post";
import { useToast } from "@/hooks/use-toast";

type Blog = {
  id: number;
  title_en: string;
  title_ar: string;
  slug: string;
  type: string;
  description_en: string | null;
  description_ar: string | null;
  content_en: string;
  content_ar: string;
  imageUrl: string | null;
  readTime: string | null;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: { 
    id: number; 
    name_en: string;
    name_ar: string;
  }[];
};

type DisplayBlogsProps = {
  initialBlogs: Blog[];
};

export default function DisplayBlogs({ initialBlogs }: DisplayBlogsProps) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const router = useRouter();
  const { toast } = useToast();

  const handleEdit = (id: number) => {
    router.push(`/admin/blog/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const result = await deletePost(id);
        if (result.success) {
          setBlogs(blogs.filter((blog) => blog.id !== id));
          toast({
            title: "Success",
            description: "Blog post deleted successfully.",
          });
        } else {
          console.error("Failed to delete blog post");
          toast({
            title: "Error",
            description: "Failed to delete blog post. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting blog post:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title (EN/AR)</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell className="font-medium">
                {blog.title_en} / {blog.title_ar}
              </TableCell>
              <TableCell className="capitalize">{blog.type}</TableCell>
              <TableCell>{blog.published ? "Yes" : "No"}</TableCell>
              <TableCell>{blog.featured ? "Yes" : "No"}</TableCell>
              <TableCell>{formatDate(blog.createdAt)}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {tag.name_en} / {tag.name_ar}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(blog.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(blog.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

