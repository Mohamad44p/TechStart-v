import {
  getFaqCategories,
  deleteFaqCategory,
} from "@/app/actions/pages/faqActions";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataActions } from "@/components/shared/data-actions";
import type { FaqCategory } from "@/types/faq";

export const revalidate = 30;
export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const categories = (await getFaqCategories()) as FaqCategory[];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">FAQ Management</h1>
        <Link
          href="/admin/pages/faq/create"
          prefetch
          passHref
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Category
        </Link>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{category.nameEn}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1" dir="rtl">
                  {category.nameAr}
                </p>
              </div>
              <DataActions
                editHref={`/admin/pages/faq/${category.id}`}
                deleteAction={deleteFaqCategory}
                deleteModalTitle="Delete FAQ Category"
                deleteModalDescription="Are you sure you want to delete this FAQ category? This will also delete all questions in this category."
                itemId={category.id}
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.faqs.map((faq) => (
                  <div key={faq.id} className="border-t pt-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium">{faq.questionEn}</h3>
                        <p className="text-sm text-muted-foreground">
                          {faq.answerEn}
                        </p>
                      </div>
                      <div className="text-right space-y-1" dir="rtl">
                        <h3 className="font-medium">{faq.questionAr}</h3>
                        <p className="text-sm text-muted-foreground">
                          {faq.answerAr}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Link
                  href={`/admin/pages/faq/${category.id}/items/create`}
                  prefetch
                  passHref
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
