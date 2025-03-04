import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 })
    }

    // Create a safe filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "-")
    const safeName = `${uniqueSuffix}-${filename}`

    // Upload to Vercel Blob
    const blob = await put(safeName, file, { access: "public" })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

