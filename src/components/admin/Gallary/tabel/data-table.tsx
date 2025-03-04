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
import { PaginatedResult, PaginationParams } from "@/app/actions/pages/team-actions";

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
  onPaginationChange?: (params: PaginationParams) => Promise<void>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  config,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: config.defaultPageSize,
  });
  
  // Use a ref to track if this is the initial render
  const isInitialRender = useRef(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Determine if we're using paginated data
  const isPaginated = data && typeof data === 'object' && 'data' in data;
  
  // Extract the actual data array and pagination info
  const tableData = isPaginated ? (data as PaginatedResult<TData>).data : (data as TData[]);
  const totalCount = isPaginated ? (data as PaginatedResult<TData>).total : tableData.length;
  const pageCount = isPaginated 
    ? (data as PaginatedResult<TData>).totalPages 
    : Math.ceil(tableData.length / pagination.pageSize);

  // Handle search
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, pageIndex: 0 }));

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Create pagination params with search
    const sortColumn = sorting.length > 0 ? sorting[0].id : 'createdAt';
    const sortDirection = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'asc';
    
    const searchParams: PaginationParams = {
      page: 1,
      pageSize: pagination.pageSize,
      sortBy: sortColumn,
      sortOrder: sortDirection as 'asc' | 'desc',
      search: value,
    };

    // Debounce the search request
    searchTimeoutRef.current = setTimeout(() => {
      if (onPaginationChange) {
        onPaginationChange(searchParams).catch(error => {
          console.error('Error during search:', error);
        });
      }
    }, 300);
  }, [sorting, pagination.pageSize, onPaginationChange]);

  // Handle pagination change
  useEffect(() => {
    // Skip the initial render to prevent an infinite loop
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (!onPaginationChange) return;

    const sortColumn = sorting.length > 0 ? sorting[0].id : 'createdAt';
    const sortDirection = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'asc';
    
    const paginationParams: PaginationParams = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortBy: sortColumn,
      sortOrder: sortDirection as 'asc' | 'desc',
      search: searchQuery,
    };
    
    onPaginationChange(paginationParams).catch(error => {
      console.error('Error during pagination:', error);
    });
  }, [pagination, sorting, onPaginationChange, searchQuery]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    manualPagination: isPaginated,
    pageCount: pageCount,
    state: {
      sorting,
      pagination,
    },
  });

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
          onValueChange={(value) => {
            setPagination(prev => ({
              ...prev,
              pageSize: Number(value),
              pageIndex: 0, // Reset to first page when changing page size
            }));
          }}
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
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
          Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of{" "}
          {totalCount} entries
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
              {table.getPageCount()}
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

