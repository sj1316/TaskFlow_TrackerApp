"use client"

import { motion } from "framer-motion"
import { Navigation } from "./navigation"
import { CheckSquare } from "lucide-react"

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TaskFlow</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Smart Task Management</p>
            </div>
          </div>

          {/* Navigation */}
          <Navigation />
        </div>
      </div>
    </motion.header>
  )
}
