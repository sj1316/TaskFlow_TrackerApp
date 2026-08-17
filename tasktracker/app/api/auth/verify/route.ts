import { type NextRequest, NextResponse } from "next/server"
import { authUtils } from "@/lib/auth"
import type { AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Token is required",
        },
        { status: 400 },
      )
    }

    const user = await authUtils.verifyToken(token)
    if (!user) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 },
      )
    }

    return NextResponse.json<AuthResponse>({
      success: true,
      user,
      message: "Token is valid",
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: "Token verification failed",
      },
      { status: 500 },
    )
  }
}
