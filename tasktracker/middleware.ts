import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { authUtils } from "./lib/auth"

export async function middleware(request: NextRequest) {
  // Check if the request is for API routes that need authentication
  if (request.nextUrl.pathname.startsWith("/api/tasks") || request.nextUrl.pathname.startsWith("/api/stats")) {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const user = await authUtils.verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Add user info to request headers for API routes to use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", user.id)
    requestHeaders.set("x-user-email", user.email)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/tasks/:path*", "/api/stats/:path*"],
}
