'use client'

import { columns } from "./columns";
import { focusareasTableConfig } from "./config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/Gallary/tabel/data-table";
import { getPaginatedFocusareas } from "@/app/actions/pages/focusareas-actions";
import { Focusarea } from "@/types/focusarea";
import { useState, useEffect, useRef } from "react";
import { PaginationParams, PaginatedResult } from "@/types/pagination";

export default function Focusareas() {
  const [focusareas, setFocusareas] = useState<PaginatedResult<Focusarea> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    pageSize: focusareasTableConfig.defaultPageSize,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
  });
  
  const initialRenderRef = useRef(true);
  const isFetchingRef = useRef(false);

  // Function to fetch focus areas with the given parameters
  const fetchFocusareas = async (params: PaginationParams) => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      
      // Ensure we're passing a valid object
      const validParams: PaginationParams = {
        page: params.page || 1,
        pageSize: params.pageSize || focusareasTableConfig.defaultPageSize,
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
        search: params.search || '',
      };
      
      const data = await getPaginatedFocusareas(validParams);
      setFocusareas(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching focus areas:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch focus areas');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    // Always fetch on initial render
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      fetchFocusareas(paginationParams);
    } else {
      // After initial render, only fetch when pagination params change
      fetchFocusareas(paginationParams);
    }
  }, [paginationParams]);

  // Handle pagination change
  const handlePaginationChange = async (params: PaginationParams): Promise<void> => {
    // Prevent unnecessary updates if the params haven't changed
    if (
      params.page === paginationParams.page &&
      params.pageSize === paginationParams.pageSize &&
      params.sortBy === paginationParams.sortBy &&
      params.sortOrder === paginationParams.sortOrder &&
      params.search === paginationParams.search
    ) {
      return;
    }
    
    // Ensure we're setting a valid object
    const newParams = {
      page: params.page || 1,
      pageSize: params.pageSize || focusareasTableConfig.defaultPageSize,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      search: params.search || '',
    };
    
    // Update the state with new parameters - this will trigger the useEffect
    setPaginationParams(newParams);
  };

  if (loading && !focusareas) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Focus Areas</h1>
          <Link href="/admin/pages/focusareas/create" passHref prefetch>
            <Button>Create New Focus Area</Button>
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading focus areas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Focus Areas</h1>
          <Link href="/admin/pages/focusareas/create" passHref prefetch>
            <Button>Create New Focus Area</Button>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Focus Areas</h1>
        <Link href="/admin/pages/focusareas/create" passHref prefetch>
          <Button>Create New Focus Area</Button>
        </Link>
      </div>
      {focusareas && (
        <DataTable 
          columns={columns} 
          data={focusareas} 
          config={focusareasTableConfig}
          onPaginationChange={handlePaginationChange}
        />
      )}
    </div>
  );
}
