export const workWithUsTableConfig = {
  statusOptions: [
    { value: "OPEN", label: "Open" },
    { value: "CLOSED", label: "Closed" },
    { value: "DRAFT", label: "Draft" }
  ] as const,

  defaultPageSize: 10,
  enableColumnFilters: true,
  enableSorting: true,
  enablePagination: true,

  statusColors: {
    OPEN: "success",
    CLOSED: "destructive",
    DRAFT: "warning"
  } as const,
}