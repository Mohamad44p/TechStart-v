export const complaintsTableConfig = {
  statusOptions: [
    { value: "PENDING", label: "Pending" },
    { value: "IN_REVIEW", label: "In Review" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "REJECTED", label: "Rejected" },
  ] as const,
  
  defaultPageSize: 10,
  
  statusColors: {
    PENDING: "warning",
    IN_REVIEW: "info",
    RESOLVED: "success",
    REJECTED: "destructive",
  } as const,
  
  filterableColumns: [
    { id: "type", title: "Type" },
    { id: "status", title: "Status" },
    { id: "description", title: "Description" }
  ],
  
  sortableColumns: ["submittedAt", "type", "status", "complaintNumber"],
} as const;
