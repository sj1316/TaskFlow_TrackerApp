"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

  const handleAuthSuccess = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {isLogin ? (
            <LoginForm onSuccess={handleAuthSuccess} onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSuccess={handleAuthSuccess} onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </motion.div>
      </div>
    </div>
  )
}
