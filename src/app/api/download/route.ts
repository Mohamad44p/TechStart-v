import { type NextRequest, NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url")
    if (!url) {
      return new NextResponse("Missing URL parameter", { status: 400 })
    }

    // Extract the file name from the URL
    const fileName = url.split("/").pop()

    if (!fileName) {
      return new NextResponse("Invalid URL", { status: 400 })
    }

    // List blobs to find the matching file
    const { blobs } = await list()
    const matchingBlob = blobs.find((blob) => blob.pathname === fileName)

    if (!matchingBlob) {
      return new NextResponse("File not found", { status: 404 })
    }

    // Fetch the file content
    const response = await fetch(matchingBlob.url)
    const fileBuffer = await response.arrayBuffer()

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/octet-stream",
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

