import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AuthProvider } from "@/hooks/use-auth"
import "./globals.css"

export const metadata: Metadata = {
  title: "TaskFlow - Smart Task Tracker",
  description: "A comprehensive task management application with analytics and smart suggestions",
  generator: "v0.app",
  keywords: ["task management", "productivity", "todo", "analytics", "dashboard"],
  authors: [{ name: "TaskFlow Team" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ErrorBoundary>
          <AuthProvider>
            <Suspense fallback={<LoadingSpinner size="lg" text="Loading TaskFlow..." />}>{children}</Suspense>
          </AuthProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
