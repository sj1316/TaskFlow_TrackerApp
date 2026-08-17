import { type NextRequest, NextResponse } from "next/server"
import { userStore } from "@/lib/user-store"
import { authUtils } from "@/lib/auth"
import type { SignupCredentials, AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: SignupCredentials = await request.json()
    const { email, password, name } = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "Name, email, and password are required",
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

    const passwordValidation = authUtils.validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: passwordValidation.message,
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await userStore.findByEmail(email)
    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 },
      )
    }

    // Create new user
    const newUser = await userStore.create({ email, password, name })
    const authUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    }

    // Generate JWT token
    const token = await authUtils.generateToken(authUser)

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        user: authUser,
        token,
        message: "Account created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: "An error occurred during signup",
      },
      { status: 500 },
    )
  }
}
