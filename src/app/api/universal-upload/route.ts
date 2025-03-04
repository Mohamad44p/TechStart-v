import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import db from "@/app/db/db"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const type = formData.get("type") as string | null
    const customName = formData.get("customName") as string | null

    if (!file || !type || !customName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const validTypes = {
      file: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
      ],
      image: ["image/jpeg", "image/png", "image/gif"],
      video: ["video/mp4", "video/webm", "video/ogg"],
    }

    if (!validTypes[type as keyof typeof validTypes].includes(file.type)) {
      return NextResponse.json({ success: false, error: "Invalid file type" }, { status: 400 })
    }

    // 100MB max size
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: "File too large" }, { status: 400 })
    }

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    })

    // Save file information to the database
    const savedItem = await db.uploadedItem.create({
      data: {
        name: customName,
        url: blob.url,
        type: type,
        mimeType: file.type,
        size: file.size,
      },
    })

    return NextResponse.json({
      success: true,
      id: savedItem.id,
      name: savedItem.name,
      url: savedItem.url,
      type: savedItem.type,
      mimeType: savedItem.mimeType,
      size: savedItem.size,
      createdAt: savedItem.createdAt,
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

export async function GET() {
  try {
    const items = await db.uploadedItem.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

