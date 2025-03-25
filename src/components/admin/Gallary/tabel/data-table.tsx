"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  PaginationState,
  ColumnFiltersState,
  getFilteredRowModel,
  Column,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PaginatedResult, PaginationParams } from "@/types/pagination";
import { ArrowUpDown } from "lucide-react";

interface TableConfig {
  statusOptions: ReadonlyArray<{
    readonly value: string;
    readonly label: string;
  }>;
  defaultPageSize: number;
  statusColors: {
    readonly [key: string]: string;
  };
  filterableColumns?: ReadonlyArray<{ readonly id: string; readonly title: string }>;
  sortableColumns?: ReadonlyArray<string>;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | PaginatedResult<TData>;
  config: TableConfig;
  onPaginationChange?: (params: PaginationParams) => Promise<void> | void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  config,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: config.defaultPageSize,
  });
  
  // Use a ref to track if this is the initial render
  const isInitialRender = useRef(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sortingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const paginationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if we're using paginated data
  const isPaginated = data && typeof data === 'object' && 'data' in data;
  
  // Determine if we're using server-side pagination (based on onPaginationChange prop)
  const isServerPagination = !!onPaginationChange;
  
  // Extract the actual data array and pagination info
  const tableData = isPaginated ? (data as PaginatedResult<TData>).data : (data as TData[]);
  const totalCount = isPaginated ? (data as PaginatedResult<TData>).total : tableData.length;
  const pageCount = isPaginated 
    ? (data as PaginatedResult<TData>).totalPages 
    : Math.ceil(tableData.length / pagination.pageSize);

  // If using server-side pagination, set the pageIndex based on the returned page
  useEffect(() => {
    if (isPaginated && isServerPagination) {
      const currentPage = (data as PaginatedResult<TData>).page;
      // Only update if different to avoid loops
      if (currentPage && currentPage !== pagination.pageIndex + 1) {
        setPagination(prev => ({
          ...prev,
          pageIndex: currentPage - 1
        }));
      }
    }
  }, [data, isPaginated, isServerPagination]);

  // Get all valid filter column IDs
  const getValidColumnIds = useCallback(() => {
    return columns.reduce((acc, column) => {
      if ('accessorKey' in column) {
        acc.push(column.accessorKey as string);
      }
      return acc;
    }, [] as string[]);
  }, [columns]);

  // Find a valid column ID to filter by
  const findValidFilterColumnId = useCallback(() => {
    const validColumnIds = getValidColumnIds();
    
    // First try to use the first filterableColumn if it exists
    if (config.filterableColumns?.length) {
      const filterColumnId = config.filterableColumns[0].id;
      if (validColumnIds.includes(filterColumnId)) {
        return filterColumnId;
      }
    } 
    
    // Otherwise try to use the first sortable column
    if (config.sortableColumns?.length) {
      const sortColumnId = config.sortableColumns[0];
      if (validColumnIds.includes(sortColumnId)) {
        return sortColumnId;
      }
    }
    
    // Finally, use the first valid column ID
    return validColumnIds.length > 0 ? validColumnIds[0] : null;
  }, [config.filterableColumns, config.sortableColumns, getValidColumnIds]);

  // Apply client-side filtering if we're not using server-side pagination
  useEffect(() => {
    if (isServerPagination || !searchQuery) {
      setColumnFilters([]);
      return;
    }
    
    const filterColumnId = findValidFilterColumnId();
    
    // Only set column filter if we have a valid column ID
    if (filterColumnId) {
      setColumnFilters([{
        id: filterColumnId,
        value: searchQuery
      }]);
    } else {
      setColumnFilters([]);
    }
  }, [searchQuery, isServerPagination, findValidFilterColumnId]);

  // Process columns to add sorting UI to sortable columns
  const processedColumns = columns.map(column => {
    // Skip columns without accessorKey or that are already configured
    if (!('accessorKey' in column) || 
        (typeof column.header !== 'string' && typeof column.header !== 'undefined')) {
      return column;
    }

    const accessorKey = column.accessorKey as string;
    
    // Check if this column is sortable according to config
    const isSortable = config.sortableColumns?.includes(accessorKey);
    
    if (isSortable) {
      return {
        ...column,
        header: ({ column }: { column: Column<TData, unknown> }) => {
          const headerText = typeof column.columnDef.header === 'string' 
            ? column.columnDef.header 
            : accessorKey;
            
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="whitespace-nowrap"
            >
              {headerText}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      };
    }
    
    return column;
  });

  // Function to get the default sort column
  const getDefaultSortColumn = useCallback(() => {
    const validColumnIds = getValidColumnIds();
    
    // First check if there's an active sort
    if (sorting.length > 0 && validColumnIds.includes(sorting[0].id)) {
      return sorting[0].id;
    }
    
    // Then check if there are sortable columns configured
    if (config.sortableColumns?.length) {
      const sortColumnId = config.sortableColumns[0];
      if (validColumnIds.includes(sortColumnId)) {
        return sortColumnId;
      }
    }
    
    // Finally, use the first valid column ID
    return validColumnIds.length > 0 ? validColumnIds[0] : 'id';
  }, [sorting, config.sortableColumns, getValidColumnIds]);

  // Helper function to send pagination updates to the server
  const sendServerPaginationUpdate = useCallback((params: PaginationParams) => {
    if (!onPaginationChange) return;
    
    if (paginationTimeoutRef.current) {
      clearTimeout(paginationTimeoutRef.current);
    }
    
    paginationTimeoutRef.current = setTimeout(() => {
      try {
        const result = onPaginationChange(params);
        // If it's a promise, add error handling
        if (result instanceof Promise) {
          result.catch(error => {
            console.error('Error during pagination update:', error);
          });
        }
      } catch (error) {
        console.error('Error calling pagination handler:', error);
      }
    }, 100);
  }, [onPaginationChange]);

  // Handle search
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Update the UI immediately
    setSearchQuery(value);
    
    // For client-side filtering, we don't need to do anything else
    if (!isServerPagination || !onPaginationChange) {
      return;
    }
    
    // Reset to first page immediately for better UX
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Get default sort column and direction
    const sortColumn = getDefaultSortColumn();
    const sortDirection = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'asc';
    
    const searchParams: PaginationParams = {
      page: 1, // Reset to first page when searching
      pageSize: pagination.pageSize,
      sortBy: sortColumn,
      sortOrder: sortDirection as 'asc' | 'desc',
      search: value,
    };

    // Debounce the search request to avoid too many API calls
    searchTimeoutRef.current = setTimeout(() => {
      sendServerPaginationUpdate(searchParams);
    }, 300);
  }, [sorting, pagination.pageSize, isServerPagination, getDefaultSortColumn, sendServerPaginationUpdate]);

  // Handle sorting change
  useEffect(() => {
    if (isInitialRender.current || !isServerPagination || !onPaginationChange) return;
    
    // Clear previous timeout
    if (sortingTimeoutRef.current) {
      clearTimeout(sortingTimeoutRef.current);
    }

    const sortColumn = getDefaultSortColumn();
    const sortDirection = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'asc';
    
    const sortParams: PaginationParams = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortBy: sortColumn,
      sortOrder: sortDirection as 'asc' | 'desc',
      search: searchQuery,
    };
    
    // Debounce the sort request
    sortingTimeoutRef.current = setTimeout(() => {
      sendServerPaginationUpdate(sortParams);
    }, 300);
  }, [sorting, onPaginationChange, pagination.pageIndex, pagination.pageSize, searchQuery, isServerPagination, getDefaultSortColumn, sendServerPaginationUpdate]);

  // Handle pagination change from the table
  useEffect(() => {
    // Skip the initial render to prevent an infinite loop
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (!isServerPagination || !onPaginationChange) return;

    // Don't trigger for sorting changes - we handle those separately
    if (sortingTimeoutRef.current) return;

    const sortColumn = getDefaultSortColumn();
    const sortDirection = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'asc';
    
    const paginationParams: PaginationParams = {
      page: pagination.pageIndex + 1, // Convert 0-based index to 1-based page
      pageSize: pagination.pageSize,
      sortBy: sortColumn,
      sortOrder: sortDirection as 'asc' | 'desc',
      search: searchQuery,
    };
    
    sendServerPaginationUpdate(paginationParams);
  }, [pagination, onPaginationChange, searchQuery, sorting, isServerPagination, getDefaultSortColumn, sendServerPaginationUpdate]);

  // Handle page size change
  const handlePageSizeChange = useCallback((value: string) => {
    const newSize = Number(value);
    setPagination(prev => ({
      pageSize: newSize,
      pageIndex: 0, // Reset to first page when changing page size
    }));
    
    // If using server pagination, trigger an update
    if (isServerPagination && onPaginationChange) {
      const sortColumn = getDefaultSortColumn();
      const sortDirection = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'asc';
      
      const params: PaginationParams = {
        page: 1, // Reset to first page
        pageSize: newSize,
        sortBy: sortColumn,
        sortOrder: sortDirection as 'asc' | 'desc',
        search: searchQuery,
      };
      
      sendServerPaginationUpdate(params);
    }
  }, [isServerPagination, onPaginationChange, getDefaultSortColumn, sorting, searchQuery, sendServerPaginationUpdate]);

  // Validate that sortableColumns actually exist in the columns array
  useEffect(() => {
    if (config.sortableColumns && config.sortableColumns.length > 0 && process.env.NODE_ENV === 'development') {
      const validColumnIds = getValidColumnIds();
      
      // Check if all sortable columns exist
      const invalidColumns = config.sortableColumns.filter(colId => !validColumnIds.includes(colId));
      
      if (invalidColumns.length > 0) {
        console.warn(
          `[DataTable] The following sortable columns do not exist in the columns array: ${invalidColumns.join(', ')}. ` +
          `Valid column IDs are: ${validColumnIds.join(', ')}`
        );
      }
    }
  }, [columns, config.sortableColumns, getValidColumnIds]);

  const table = useReactTable({
    data: tableData || [],
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    manualPagination: isServerPagination,
    pageCount: isServerPagination ? pageCount : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      pagination,
      columnFilters,
    },
  });

  // Ensure counts are valid numbers
  const validTotalCount = totalCount || 0;
  const validPageCount = pageCount || 1;
  
  // Calculate current page info for display
  const startIndex = validTotalCount > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endIndex = validTotalCount > 0 ? Math.min((pagination.pageIndex + 1) * pagination.pageSize, validTotalCount) : 0;
  const showingText = validTotalCount > 0 
    ? `Showing ${startIndex} to ${endIndex} of ${validTotalCount} entries`
    : 'No entries to show';

  return (
    <div>
      {/* Search and filters */}
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Select
          value={pagination.pageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {showingText}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Page</span>
            <span className="text-sm font-medium">
              {table.getState().pagination.pageIndex + 1} of{" "}
              {validPageCount}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}

