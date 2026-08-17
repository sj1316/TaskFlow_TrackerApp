"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Target, BarChart3, Lightbulb } from "lucide-react"
import type { TaskSuggestion } from "@/lib/types"

interface TaskSuggestionsProps {
  suggestions: TaskSuggestion[]
}

export function TaskSuggestions({ suggestions }: TaskSuggestionsProps) {
  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p>Great job! No suggestions at the moment.</p>
            <p className="text-sm mt-1">Keep up the excellent work!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getIcon = (type: TaskSuggestion["type"]) => {
    switch (type) {
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      case "priority":
        return <Target className="h-4 w-4" />
      case "workload":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getVariant = (type: TaskSuggestion["type"]) => {
    switch (type) {
      case "overdue":
        return "destructive"
      case "priority":
        return "default"
      case "workload":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <Badge variant={getVariant(suggestion.type)} className="mt-0.5">
                  {getIcon(suggestion.type)}
                </Badge>
                <p className="text-sm text-pretty flex-1">{suggestion.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
