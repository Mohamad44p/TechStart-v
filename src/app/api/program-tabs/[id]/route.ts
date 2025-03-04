/* eslint-disable @typescript-eslint/no-unused-vars */
import db from "@/app/db/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const programTab = await db.programTab.findUnique({
      where: { id: params.id },
      include: {
        programPage: true,
        buttons: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!programTab) {
      return NextResponse.json({ error: "Program tab not found" }, { status: 404 })
    }

    return NextResponse.json(programTab)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch program tab" }, { status: 500 })
  }
}
