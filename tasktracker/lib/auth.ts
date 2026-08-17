import * as jose from "jose"
import bcrypt from "bcryptjs"
import type { AuthUser } from "./types"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export const authUtils = {
  hashPassword: async (password: string): Promise<string> => {
    return bcrypt.hash(password, 12)
  },

  comparePassword: async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
  },

  generateToken: async (user: AuthUser): Promise<string> => {
    const jwt = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    return jwt
  },

  verifyToken: async (token: string): Promise<AuthUser | null> => {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET)
      return payload as AuthUser
    } catch (error) {
      return null
    }
  },

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  validatePassword: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
      return { valid: false, message: "Password must be at least 6 characters long" }
    }
    return { valid: true }
  },
}
