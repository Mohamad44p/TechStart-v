export const videoGalleryConfig = {
  defaultPageSize: 10,
  
  filterableColumns: [
    { id: "titleEn", title: "Title (English)" },
    { id: "titleAr", title: "Title (Arabic)" },
  ],
  
  sortableColumns: ["titleEn", "titleAr", "createdAt"],

  statusOptions: [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" }
  ] as const,

  statusColors: {
    ACTIVE: "success",
    INACTIVE: "destructive"
  } as const,
} as const
