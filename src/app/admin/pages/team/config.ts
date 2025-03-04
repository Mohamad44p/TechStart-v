export const teamTableConfig = {
  defaultPageSize: 10,
  
  filterableColumns: [
    { id: "nameEn", title: "Name (English)" },
    { id: "nameAr", title: "Name (Arabic)" },
    { id: "jobTitleEn", title: "Job Title (English)" },
    { id: "jobTitleAr", title: "Job Title (Arabic)" },
  ],
  
  sortableColumns: ["nameEn", "nameAr", "createdAt", "updatedAt"],

  // Required properties for TableConfig interface
  statusOptions: [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" }
  ],

  statusColors: {
    ACTIVE: "success",
    INACTIVE: "destructive"
  },
} as const
