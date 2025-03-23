import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });

    response.cookies.set("MOHAMAD_TOKEN", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
      maxAge: 0,
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
} 