'use client'

import { useState, useEffect, useRef } from 'react'
import { columns } from "./columns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComplaintTableSkeleton } from "./loading"
import { DataTable } from "@/components/admin/Gallary/tabel/data-table"
import { complaintsTableConfig } from "./config"
import type { Complaint } from "@/types/complaint"
import { PaginatedResult, PaginationParams } from "@/types/pagination"
import { getComplaintStats, getPaginatedComplaints } from "@/app/actions/complaints-actions"

interface ComplaintsDataTableProps {
  data: PaginatedResult<Complaint>
  onPaginationChange: (params: PaginationParams) => void
}

function ComplaintsDataTable({ data, onPaginationChange }: ComplaintsDataTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      config={complaintsTableConfig}
      onPaginationChange={onPaginationChange}
    />
  )
}

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [stats, setStats] = useState({ total: 0, pending: 0, inReview: 0, resolved: 0 })
  const [complaints, setComplaints] = useState<PaginatedResult<Complaint> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paginationParams, setPaginationParams] = useState<PaginationParams & { status?: string }>({
    page: 1,
    pageSize: complaintsTableConfig.defaultPageSize,
    sortBy: 'submittedAt',
    sortOrder: 'desc',
    search: '',
    status: 'all'
  })
  
  const initialRenderRef = useRef(true)
  const isFetchingRef = useRef(false)

  // Fetch stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const statsData = await getComplaintStats()
        setStats(statsData)
      } catch (err) {
        console.error('Error fetching complaint stats:', err)
      }
    }
    
    fetchStats()
  }, [])

  // Function to fetch complaints with the given parameters
  const fetchComplaints = async (params: PaginationParams & { status?: string }) => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return
    
    try {
      isFetchingRef.current = true
      setLoading(true)
      
      const data = await getPaginatedComplaints({
        ...params,
        status: params.status || activeTab
      })
      
      setComplaints(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching complaints:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch complaints')
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setPaginationParams({
      ...paginationParams,
      page: 1, // Reset to first page on tab change
      status: tab
    })
  }

  useEffect(() => {
    // Always fetch on initial render or tab change
    if (initialRenderRef.current) {
      initialRenderRef.current = false
    }
    
    // Fetch data whenever pagination params change 
    fetchComplaints(paginationParams)
  }, [paginationParams])

  // Handle pagination change
  const handlePaginationChange = (params: PaginationParams): Promise<void> => {
    // Prevent unnecessary updates if only pagination changes that don't affect status
    const newParams = {
      ...params,
      status: activeTab
    }
    
    setPaginationParams(newParams)
    return Promise.resolve()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <StatsCard title="Total Complaints" value={stats.total} />
        <StatsCard title="Pending" value={stats.pending} type="warning" />
        <StatsCard title="In Review" value={stats.inReview} type="info" />
        <StatsCard title="Resolved" value={stats.resolved} type="success" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaints Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-review">In Review</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            {loading && !complaints ? (
              <ComplaintTableSkeleton />
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mt-4">
                <strong className="font-bold">Error: </strong>
                <span>{error}</span>
              </div>
            ) : complaints ? (
              <TabsContent value={activeTab}>
                <ComplaintsDataTable 
                  data={complaints} 
                  onPaginationChange={handlePaginationChange} 
                />
              </TabsContent>
            ) : null}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: number
  type?: "default" | "warning" | "info" | "success"
}

function StatsCard({ title, value, type = "default" }: StatsCardProps) {
  return (
    <Card
      className={`${
        type === "warning"
          ? "border-yellow-500"
          : type === "info"
          ? "border-blue-500"
          : type === "success"
          ? "border-green-500"
          : "border-gray-200"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
