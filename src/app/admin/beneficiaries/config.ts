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
}