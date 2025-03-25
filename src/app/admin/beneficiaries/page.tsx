'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from '@/components/admin/Gallary/tabel/data-table'
import { Beneficiary } from "@prisma/client"
import { beneficiariesTableConfig } from './config'
import { useState, useEffect, useRef } from "react"
import { PaginationParams, PaginatedResult } from "@/types/pagination"
import { getPaginatedBeneficiaries } from "@/app/actions/beneficiaryActions"

export interface FormattedBeneficiary extends Omit<Beneficiary, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name_en: string;
    name_ar: string;
  };
}

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<PaginatedResult<FormattedBeneficiary> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    pageSize: beneficiariesTableConfig.defaultPageSize,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
  })
  
  const initialRenderRef = useRef(true)
  const isFetchingRef = useRef(false)

  // Function to fetch beneficiaries with the given parameters
  const fetchBeneficiaries = async (params: PaginationParams) => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return
    
    try {
      isFetchingRef.current = true
      setLoading(true)
      
      // Ensure we're passing a valid object to getBeneficiaries
      const validParams: PaginationParams = {
        page: params.page || 1,
        pageSize: params.pageSize || beneficiariesTableConfig.defaultPageSize,
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
        search: params.search || '',
      }
      
      const data = await getPaginatedBeneficiaries(validParams)
      
      // Format dates for display
      const formattedData = {
        ...data,
        data: data.data.map(b => ({
          ...b,
          createdAt: new Date(b.createdAt).toISOString().split('T')[0],
          updatedAt: new Date(b.updatedAt).toISOString().split('T')[0],
        })) as FormattedBeneficiary[]
      }
      
      setBeneficiaries(formattedData as PaginatedResult<FormattedBeneficiary>)
      setError(null)
    } catch (err) {
      console.error('Error fetching beneficiaries:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch beneficiaries')
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }

  useEffect(() => {
    // Always fetch on initial render
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      fetchBeneficiaries(paginationParams)
    } else {
      // After initial render, only fetch when pagination params change
      fetchBeneficiaries(paginationParams)
    }
  }, [paginationParams])

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
      return
    }
    
    // Ensure we're setting a valid object
    const newParams = {
      page: params.page || 1,
      pageSize: params.pageSize || beneficiariesTableConfig.defaultPageSize,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      search: params.search || '',
    }
    
    // Update the state with new parameters - this will trigger the useEffect
    setPaginationParams(newParams)
  }

  if (loading && !beneficiaries) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Beneficiaries Management</h1>
          <Link prefetch passHref href="/admin/beneficiaries/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Beneficiary
            </Button>
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading beneficiaries...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Beneficiaries Management</h1>
          <Link prefetch passHref href="/admin/beneficiaries/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Beneficiary
            </Button>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Beneficiaries Management</h1>
        <Link prefetch passHref href="/admin/beneficiaries/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Beneficiary
          </Button>
        </Link>
      </div>
      {beneficiaries && (
        <DataTable 
          columns={columns} 
          data={beneficiaries} 
          config={beneficiariesTableConfig}
          onPaginationChange={handlePaginationChange}
        />
      )}
    </div>
  )
}
