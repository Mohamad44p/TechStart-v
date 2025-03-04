import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SignJWT } from "jose"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Missing required environment variables")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = await new SignJWT({ email, role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(rememberMe ? "1y" : "1d")
        .sign(JWT_SECRET)

      const response = NextResponse.json({ success: true, message: "Login successful" })

      response.cookies.set({
        name: "ADMIN_TOKEN",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: rememberMe ? 31536000 : 86400,
      })

      return response
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

