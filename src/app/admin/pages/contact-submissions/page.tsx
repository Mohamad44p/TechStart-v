'use client'

import { getPaginatedContactSubmissions, ContactSubmission } from "@/app/actions/pages/contact-actions"
import { columns } from "./columns"
import { DataTable } from "@/components/admin/Gallary/tabel/data-table"
import { useState, useEffect, useRef } from "react"
import { PaginationParams, PaginatedResult } from "@/types/pagination"

const tableConfig = {
  statusOptions: [
    { value: "new", label: "New" },
    { value: "read", label: "Read" },
    { value: "archived", label: "Archived" }
  ],
  defaultPageSize: 10,
  statusColors: {
    new: "bg-blue-100 text-blue-800",
    read: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800"
  },
  sortableColumns: ["name", "email", "subject", "status", "createdAt"]
};

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<PaginatedResult<ContactSubmission> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    pageSize: tableConfig.defaultPageSize,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
  });
  
  const initialRenderRef = useRef(true);
  const isFetchingRef = useRef(false);

  // Function to fetch contact submissions with the given parameters
  const fetchSubmissions = async (params: PaginationParams) => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      
      // Ensure we're passing a valid object
      const validParams: PaginationParams = {
        page: params.page || 1,
        pageSize: params.pageSize || tableConfig.defaultPageSize,
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
        search: params.search || '',
      };
      
      const data = await getPaginatedContactSubmissions(validParams);
      setSubmissions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching contact submissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contact submissions');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    // Always fetch on initial render
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      fetchSubmissions(paginationParams);
    } else {
      // After initial render, only fetch when pagination params change
      fetchSubmissions(paginationParams);
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
      pageSize: params.pageSize || tableConfig.defaultPageSize,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      search: params.search || '',
    };
    
    // Update the state with new parameters - this will trigger the useEffect
    setPaginationParams(newParams);
  };

  if (loading && !submissions) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Contact Form Submissions</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Contact Form Submissions</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Form Submissions</h1>
      {submissions && (
        <DataTable 
          columns={columns} 
          data={submissions} 
          config={tableConfig}
          onPaginationChange={handlePaginationChange}
        />
      )}
    </div>
  );
}

