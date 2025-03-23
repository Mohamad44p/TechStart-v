import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const CREDENTIALS_API_URL = "https://email-api-j36y.onrender.com/verify";

async function verifyCredentialsExternally(email: string, password: string) {
  try {
    const response = await fetch(CREDENTIALS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.verified) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error verifying credentials:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const isVerified = await verifyCredentialsExternally(email, password);
    
    if (!isVerified) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({ email, role: "developer" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key"));

    const response = NextResponse.json({ success: true });

    response.cookies.set("MOHAMAD_TOKEN", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
} 