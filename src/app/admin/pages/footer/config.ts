export const footerTableConfig = {
  defaultPageSize: 10,
  enableSearch: true,
  searchPlaceholder: "Search footer content...",
  filterableColumns: [
    { id: "techStartTitle_en", title: "Title (English)" },
    { id: "techStartTitle_ar", title: "Title (Arabic)" }
  ],
  sortableColumns: ["createdAt", "techStartTitle_en", "techStartTitle_ar"],
  
  statusOptions: [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "DRAFT", label: "Draft" }
  ] as const,
  
  statusColors: {
    ACTIVE: "success",
    INACTIVE: "destructive",
    DRAFT: "warning"
  } as const,
} as const;
