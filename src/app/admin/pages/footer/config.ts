export const footerTableConfig = {
  defaultPageSize: 10,
  enableSearch: true,
  searchPlaceholder: "Search footer content...",
  filterableColumns: ["name_en", "name_ar"],
  sortableColumns: ["createdAt", "name_en", "name_ar", "order"],
  
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
