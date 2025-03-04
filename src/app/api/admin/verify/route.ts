import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("ADMIN_TOKEN")?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No token found",
        },
        { status: 401 },
      )
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)

    return NextResponse.json(
      {
        success: true,
        message: "Verified",
        user: payload,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Invalid token",
      },
      { status: 401 },
    )
  }
}

