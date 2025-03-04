import { NextResponse } from "next/server"
import db from "@/app/db/db"

export async function GET() {
  try {
    const tags = await db.tag.findMany({
      select: {
        id: true,
        name_en: true,
        name_ar: true,
      },
      orderBy: {
        name_en: 'asc',
      },
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}
