import db from '@/app/db/db'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const data = await req.json()
    const complaint = await db.complaint.update({
      where: { id: params.id },
      data: {
        status: data.status,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(complaint)
  } catch (error) {
    console.error('Error updating complaint:', error)
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await db.complaint.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting complaint:', error)
    return NextResponse.json(
      { error: 'Failed to delete complaint' },
      { status: 500 }
    )
  }
}
