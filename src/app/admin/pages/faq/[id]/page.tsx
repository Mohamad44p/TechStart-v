import { notFound } from "next/navigation";
import {
  getFaqCategoryById,
  deleteFaqItem,
} from "@/app/actions/pages/faqActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataActions } from "@/components/shared/data-actions";
import type { FaqCategory } from "@/types/faq";

// Enable ISR with 30-second revalidation
export const revalidate = 30;

export default async function FaqCategoryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const category = (await getFaqCategoryById(params.id)) as FaqCategory | null;

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{category.nameEn}</h1>
          <p className="text-muted-foreground mt-1" dir="rtl">
            {category.nameAr}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/pages/faq/${category.id}/items/create`}
            prefetch
            passHref
            className={buttonVariants({ variant: "default" })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Link>
          <Link
            href="/admin/pages/faq"
            prefetch
            passHref
            className={buttonVariants({ variant: "outline" })}
          >
            Back to Categories
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQ Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {category.faqs.map((faq) => (
              <div
                key={faq.id}
                className="border-t pt-4 first:border-t-0 first:pt-0"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{faq.questionEn}</h3>
                      <DataActions
                        editHref={`/admin/pages/faq/${category.id}/items/${faq.id}`}
                        deleteAction={deleteFaqItem}
                        deleteModalTitle="Delete FAQ Item"
                        deleteModalDescription="Are you sure you want to delete this FAQ item? This action cannot be undone."
                        itemId={faq.id}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {faq.answerEn}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-1" dir="rtl">
                  <h3 className="font-medium">{faq.questionAr}</h3>
                  <p className="text-sm text-muted-foreground">
                    {faq.answerAr}
                  </p>
                </div>
              </div>
            ))}
            {category.faqs.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No FAQ items found.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click the Add Question button to create your first FAQ item.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
