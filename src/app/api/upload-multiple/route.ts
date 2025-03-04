import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const urls: string[] = []

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      const filename = value.name.replace(/[^a-zA-Z0-9.-]/g, "-")
      const safeName = `${uniqueSuffix}-${filename}`

      try {
        const blob = await put(safeName, value, { access: "public" })
        urls.push(blob.url)
      } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ success: true, urls })
}

