import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
  }

  // Validate file type and size
  const validTypes = ["video/mp4", "video/webm", "video/ogg"]
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ success: false, error: "Invalid file type" }, { status: 400 })
  }

  // 100MB max size
  const maxSize = 100 * 1024 * 1024
  if (file.size > maxSize) {
    return NextResponse.json({ success: false, error: "File too large" }, { status: 400 })
  }

  try {
    const blob = await put(`videos/${nanoid()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      type: "blob",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save file",
      },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

