"use server"

import db from "@/app/db/db"
import { Complaint } from "@/types/complaint"
import { PaginatedResult, PaginationParams } from "@/types/pagination"

// Get complaint statistics
export async function getComplaintStats() {
  const [total, pending, inReview, resolved] = await Promise.all([
    db.complaint.count(),
    db.complaint.count({ where: { status: "PENDING" } }),
    db.complaint.count({ where: { status: "IN_REVIEW" } }),
    db.complaint.count({ where: { status: "RESOLVED" } }),
  ])

  return { total, pending, inReview, resolved }
}

// Get paginated complaints
export async function getPaginatedComplaints(params?: PaginationParams & { status?: string }): Promise<PaginatedResult<Complaint>> {
  try {
    // Ensure params is always an object with default values
    const safeParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
      sortBy: params?.sortBy ?? 'submittedAt',
      sortOrder: (params?.sortOrder ?? 'desc') as 'asc' | 'desc',
      search: params?.search ?? '',
      status: params?.status && params.status !== 'all' 
        ? params.status.toUpperCase().replace("-", "_") 
        : undefined
    }

    // Calculate skip value for pagination
    const skip = (safeParams.page - 1) * safeParams.pageSize

    // Build where clause for search and status filter
    let where: any = {}
    
    // Add status filter if provided
    if (safeParams.status) {
      where.status = safeParams.status
    }
    
    // Add search if provided
    if (safeParams.search) {
      where.OR = [
        { name: { contains: safeParams.search, mode: 'insensitive' } },
        { email: { contains: safeParams.search, mode: 'insensitive' } }, 
        { phone: { contains: safeParams.search, mode: 'insensitive' } },
        { description: { contains: safeParams.search, mode: 'insensitive' } },
        { complaintNumber: { contains: safeParams.search, mode: 'insensitive' } }
      ]
    }

    // Get total count for pagination
    const total = await db.complaint.count({ where })

    // Get paginated data
    const complaints = await db.complaint.findMany({
      where,
      include: {
        attachments: true,
        notes: true
      },
      orderBy: { [safeParams.sortBy]: safeParams.sortOrder },
      skip,
      take: safeParams.pageSize,
    })

    // Calculate total pages
    const totalPages = Math.ceil(total / safeParams.pageSize)

    // Return formatted result for the DataTable component
    return {
      data: complaints as unknown as Complaint[],
      total,
      page: safeParams.page,
      pageSize: safeParams.pageSize,
      totalPages,
    }
  } catch (error) {
    console.error('Error fetching paginated complaints:', error)
    throw error
  }
}

// Update complaint status
export async function updateComplaintStatus(id: string, status: string) {
  try {
    await db.complaint.update({
      where: { id },
      data: { status },
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error updating complaint status:', error)
    return { success: false, error: 'Failed to update complaint status' }
  }
} 