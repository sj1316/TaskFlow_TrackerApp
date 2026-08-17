"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, CheckSquare } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ComponentType<{ className?: string }>
}

export function EmptyState({ title, description, actionLabel, onAction, icon: Icon = CheckSquare }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-balance">{title}</h3>
            <p className="text-muted-foreground text-pretty max-w-md mx-auto">{description}</p>
          </div>
          {actionLabel && onAction && (
            <Button onClick={onAction} className="gap-2">
              <Plus className="h-4 w-4" />
              {actionLabel}
            </Button>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}
