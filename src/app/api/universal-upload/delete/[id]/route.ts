import { NextResponse } from "next/server"
import { del } from "@vercel/blob"
import db from "@/app/db/db"

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id

    // Find the item in the database
    const item = await db.uploadedItem.findUnique({
      where: { id },
    })

    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }

    // Delete the file from Vercel Blob
    await del(item.url)

    // Delete the item from the database
    await db.uploadedItem.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Item deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete item",
      },
      { status: 500 },
    )
  }
}

