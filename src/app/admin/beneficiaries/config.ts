export const beneficiariesTableConfig = {
  defaultPageSize: 10,
  statusOptions: [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ] as const,
  statusColors: {
    ACTIVE: "success",
    INACTIVE: "destructive",
  } as const,
  filterableColumns: [
    { id: "title_en", title: "Title (English)" },
    { id: "title_ar", title: "Title (Arabic)" },
    { id: "category.name_en", title: "Category" }
  ],
  sortableColumns: ["title_en", "title_ar", "createdAt", "updatedAt"],
} as const;