"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarDays, Clock, MoreVertical, Pencil, Trash2 } from "lucide-react"
import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => Promise<boolean>
  onDelete: (id: string) => Promise<boolean>
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (checked: boolean) => {
    setIsUpdating(true)
    const updates: Partial<Task> = {
      status: checked ? "completed" : "pending",
      completedAt: checked ? new Date().toISOString() : undefined,
    }
    await onUpdate(task.id, updates)
    setIsUpdating(false)
  }

  const handleDelete = async () => {
    setIsUpdating(true)
    await onDelete(task.id)
    setIsUpdating(false)
  }

  const isOverdue = task.status === "pending" && new Date(task.dueDate) < new Date()
  const dueDate = new Date(task.dueDate)
  const isToday = dueDate.toDateString() === new Date().toDateString()

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("transition-all duration-200 hover:shadow-md", task.status === "completed" && "opacity-75")}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={handleStatusChange}
                disabled={isUpdating}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-medium text-balance leading-tight",
                    task.status === "completed" && "line-through text-muted-foreground",
                  )}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1 text-pretty">{task.description}</p>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              <div className={cn("flex items-center gap-1 text-sm", isOverdue && "text-destructive")}>
                {isToday ? <Clock className="h-3 w-3" /> : <CalendarDays className="h-3 w-3" />}
                <span>{isToday ? "Today" : dueDate.toLocaleDateString()}</span>
              </div>
            </div>
            {isOverdue && <Badge variant="destructive">Overdue</Badge>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
