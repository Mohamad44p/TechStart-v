import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const locales = ["en", "ar"];
const defaultLocale = "en";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;

  // Handle specific article redirects
  if (pathname.match(/^\/[a-z]{2}\/Article\/36\/complaints$/i)) {
    const locale = pathname.split("/")[1];
    return NextResponse.redirect(
      new URL(`/${locale}/submit-complaint`, request.url)
    );
  }

  if (pathname.match(/^\/[a-z]{2}\/Article\/23\/contact-us$/i)) {
    const locale = pathname.split("/")[1];
    return NextResponse.redirect(new URL(`/${locale}/Contact-us`, request.url));
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("ADMIN_TOKEN")?.value;

    console.log("Middleware - Token:", token ? "Present" : "Not present");

    // Allow access to login page
    if (pathname === "/admin/login") {
      if (token) {
        try {
          await jwtVerify(token, JWT_SECRET);
          return NextResponse.redirect(new URL("/admin", request.url));
        } catch (error) {
          console.error("Token verification failed:", error);
        }
      }
      return NextResponse.next();
    }

    if (!token) {
      console.log("Middleware - No token, redirecting to login");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Special protected route for mohamadmon
  if (pathname.startsWith("/mohamadmon")) {
    const mohamadToken = request.cookies.get("MOHAMAD_TOKEN")?.value;

    // Allow access to mohamadmon login page
    if (pathname === "/mohamadmon/login") {
      if (mohamadToken) {
        try {
          await jwtVerify(mohamadToken, JWT_SECRET);
          return NextResponse.redirect(new URL("/mohamadmon", request.url));
        } catch (error) {
          console.error("Mohamad token verification failed:", error);
        }
      }
      return NextResponse.next();
    }

    if (!mohamadToken) {
      console.log(
        "Middleware - No mohamad token, redirecting to mohamad login"
      );
      return NextResponse.redirect(new URL("/mohamadmon/login", request.url));
    }

    try {
      await jwtVerify(mohamadToken, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error("Mohamad token verification failed:", error);
      return NextResponse.redirect(new URL("/mohamadmon/login", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/videos/")) {
    const path = request.nextUrl.pathname.replace(/^\/[a-z]{2}\//, "/");
    const response = NextResponse.rewrite(new URL(path, request.url));

    response.headers.set("Accept-Ranges", "bytes");
    response.headers.set("Content-Type", "video/mp4");

    response.headers.set(
      "Content-Security-Policy",
      `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https: *.ytimg.com;
        media-src 'self' blob: https: http:;
        frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
        connect-src 'self' https:;
        worker-src 'self' blob:;
        frame-ancestors 'self';
      `
        .replace(/\s{2,}/g, " ")
        .trim()
    );

    response.headers.set("Set-Cookie", "SameSite=Lax; Secure; Path=/;");

    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );

    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set(
      "Permissions-Policy",
      "accelerometer=(), autoplay=(), camera=(), clipboard-write=(), encrypted-media=(), fullscreen=*, gyroscope=(), magnetometer=(), microphone=(), picture-in-picture=*, sync-xhr=(), usb=()"
    );

    return response;
  }

  if (request.nextUrl.pathname.startsWith("/uploads/videos/")) {
    const response = NextResponse.next();

    response.headers.set("Accept-Ranges", "bytes");
    response.headers.set("Content-Type", "video/mp4");

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Range");

    return response;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(ico|jpg|jpeg|png|gif|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const locale = savedLocale || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  const pathnameParts = pathname.split("/");
  const pathnameLocale = pathnameParts[1];

  if (!locales.includes(pathnameLocale)) {
    const locale = savedLocale || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  const response = NextResponse.next();

  if (pathnameLocale !== savedLocale) {
    response.cookies.set("NEXT_LOCALE", pathnameLocale, {
      path: "/",
      maxAge: 31536000, // 1 year
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  response.headers.set("Set-Cookie", "SameSite=Lax; Secure; Path=/;");

  response.headers.set(
    "Content-Security-Policy",
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: *.ytimg.com;
      media-src 'self' blob: https: http:;
      frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
      connect-src 'self' https:;
      worker-src 'self' blob:;
      frame-ancestors 'self';
    `
      .replace(/\s{2,}/g, " ")
      .trim()
  );

  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set(
    "Permissions-Policy",
    "accelerometer=(), autoplay=(), camera=(), clipboard-write=(), encrypted-media=(), fullscreen=*, gyroscope=(), magnetometer=(), microphone=(), picture-in-picture=*, sync-xhr=(), usb=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/mohamadmon/:path*",
    "/videos/:path*",
    "/((?!api|_next|admin|assets|favicon.ico).*)",
    "/uploads/videos/:path*",
    "/api/upload-video",
    "/api/delete-video",
  ],
};
