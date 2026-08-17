import { type NextRequest, NextResponse } from "next/server"
import { userStore } from "@/lib/user-store"
import { authUtils } from "@/lib/auth"
import type { LoginCredentials, AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      )
    }

    if (!authUtils.validateEmail(email)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Please enter a valid email address",
        },
        { status: 400 },
      )
    }

    // Authenticate user
    const user = await userStore.authenticate({ email, password })
    if (!user) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Generate JWT token
    const token = await authUtils.generateToken(user)

    return NextResponse.json<AuthResponse>({
      success: true,
      user,
      token,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: "An error occurred during login",
      },
      { status: 500 },
    )
  }
}
