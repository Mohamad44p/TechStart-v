import { getAboutUs, deleteAboutUs } from '@/app/actions/pages/about-us-actions'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AVAILABLE_ICONS } from '@/config/icons'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { DataActions } from '@/components/shared/data-actions'
import { DatabaseErrorDisplay } from '@/components/admin/shared/DatabaseErrorDisplay'

export default async function AboutPage() {
  let aboutUs = null;
  let error = null;
  
  try {
    aboutUs = await getAboutUs();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to connect to the database';
    console.error('Error fetching about us data:', err);
  }

  // Handle database connection error
  if (error) {
    return (
      <DatabaseErrorDisplay
        title="About Us Page"
        error={error}
        createHref="/admin/pages/about/create"
        createLabel="Create About Us"
      />
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">About Us Page</h1>
        {!aboutUs ? (
          <Link prefetch passHref href="/admin/pages/about/create" className={buttonVariants({ variant: "default" })}>
            <Plus className="h-4 w-4 mr-2" />
            Create About Us
          </Link>
        ) : (
          <DataActions
            editHref={`/admin/pages/about/${aboutUs.id}`}
            deleteAction={deleteAboutUs}
            deleteModalTitle="Delete About Us"
            deleteModalDescription="Are you sure you want to delete this About Us page? This action cannot be undone."
            itemId={aboutUs.id}
          />
        )}
      </div>

      {aboutUs ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">English Content</h3>
                  <h4 className="text-lg font-medium">{aboutUs.titleEn}</h4>
                  <p className="text-muted-foreground">{aboutUs.descriptionEn}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Arabic Content</h3>
                  <h4 className="text-lg font-medium" dir="rtl">{aboutUs.titleAr}</h4>
                  <p className="text-muted-foreground" dir="rtl">{aboutUs.descriptionAr}</p>
                </div>
              </div>
              {aboutUs.imageUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={aboutUs.imageUrl}
                    alt="About Us"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {aboutUs.cards && aboutUs.cards.map((card) => {
              const IconComponent = card.icon ? AVAILABLE_ICONS[card.icon] as React.ElementType : null
              return (
                <Card key={card.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      {IconComponent && (
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{card.titleEn}</h3>
                        <p className="text-sm text-muted-foreground">{card.descriptionEn}</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-right" dir="rtl">{card.titleAr}</h3>
                      <p className="text-sm text-muted-foreground text-right" dir="rtl">
                        {card.descriptionAr}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No About Us information available.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Click the Create button to add About Us content.
          </p>
        </div>
      )}
    </div>
  )
}

