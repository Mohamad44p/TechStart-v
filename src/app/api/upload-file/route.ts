import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Create a safe filename
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase()
    const uniqueFilename = `${timestamp}-${safeName}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, { access: "public" })

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    console.error("Error saving file:", error)
    return NextResponse.json({ success: false, error: "Failed to save file" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

