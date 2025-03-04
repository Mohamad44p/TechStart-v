import { NextResponse } from "next/server"
import { del } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ success: false, error: "No URL provided" }, { status: 400 })
    }

    // Handle blob video deletion
    if (url.includes(".vercel.blob.")) {
      try {
        await del(url)
        return NextResponse.json({ success: true })
      } catch (error) {
        console.error("Blob deletion error:", error)
        throw error
      }
    }

    // For YouTube videos, just return success
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid video URL",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete file",
      },
      { status: 500 },
    )
  }
}

