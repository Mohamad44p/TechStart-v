import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "No image URL provided" }, { status: 400 })
    }

    // Delete the file from Vercel Blob
    await del(imageUrl)

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      path: imageUrl,
    })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete file",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

