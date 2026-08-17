import { type NextRequest, NextResponse } from "next/server"
import { authUtils } from "@/lib/auth"
import type { AuthUser } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await authUtils.verifyToken(token)

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json<{ authenticated: true; user: AuthUser }>({
      authenticated: true,
      user,
    })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}