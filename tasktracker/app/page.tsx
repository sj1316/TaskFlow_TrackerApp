"use client"

import { Dashboard } from "@/components/dashboard"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProtectedRoute } from "@/components/protected-route"

export default function HomePage() {
  return (
    <ProtectedRoute>
      <LayoutWrapper>
        <Dashboard />
      </LayoutWrapper>
    </ProtectedRoute>
  )
}
