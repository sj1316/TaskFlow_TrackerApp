"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import type { AuthUser, LoginCredentials, SignupCredentials, AuthResponse, AuthCheckResponse } from "@/lib/types"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  signup: (credentials: SignupCredentials) => Promise<AuthResponse>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("auth_token")
    if (token) {
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/check", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const data: AuthCheckResponse = await response.json()

      if (data.authenticated && data.user) {
        setUser(data.user)
        localStorage.setItem("user_id", data.user.id)
      } else {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_id")
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      localStorage.removeItem("auth_token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.user && data.token) {
        setUser(data.user)
        localStorage.setItem("auth_token", data.token)
      }

      return data
    } catch (error) {
      console.error("Login failed:", error)
      return { success: false, message: "Network error occurred" }
    }
  }

  const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.user && data.token) {
        setUser(data.user)
        localStorage.setItem("auth_token", data.token)
      }

      return data
    } catch (error) {
      console.error("Signup failed:", error)
      return { success: false, message: "Network error occurred" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_id")
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
