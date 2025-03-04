import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"

export async function DELETE(request: NextRequest) {
  try {
    const fileUrl = request.nextUrl.searchParams.get("fileUrl")

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "No file URL provided" }, { status: 400 })
    }

    await del(fileUrl)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete route:", error)
    return NextResponse.json({ success: false, error: "Failed to delete file" }, { status: 500 })
  }
}

