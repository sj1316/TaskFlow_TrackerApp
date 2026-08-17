"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus } from "lucide-react"
import { TaskCard } from "./task-card"
import { EmptyState } from "./empty-state"
import type { Task } from "@/lib/types"

interface TaskListProps {
  tasks: Task[]
  onUpdate: (id: string, updates: Partial<Task>) => Promise<boolean>
  onDelete: (id: string) => Promise<boolean>
  onEdit: (task: Task) => void
  onCreateNew: () => void
}

export function TaskList({ tasks, onUpdate, onDelete, onEdit, onCreateNew }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "created">("dueDate")

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const pendingTasks = filteredAndSortedTasks.filter((task) => task.status === "pending")
  const completedTasks = filteredAndSortedTasks.filter((task) => task.status === "completed")

  // Show empty state if no tasks exist at all
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Create your first task to get started with TaskFlow. Organize your work and boost your productivity!"
        actionLabel="Create First Task"
        onAction={onCreateNew}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-balance">Your Tasks</h2>
          <p className="text-muted-foreground">Manage and track your daily tasks</p>
        </div>
        <Button onClick={onCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="created">Created Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Show empty state if no filtered tasks */}
      {filteredAndSortedTasks.length === 0 ? (
        <EmptyState
          title="No tasks match your filters"
          description="Try adjusting your search terms or filters to find the tasks you're looking for."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm("")
            setStatusFilter("all")
            setPriorityFilter("all")
          }}
        />
      ) : (
        /* Task Lists */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Tasks */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Pending Tasks</h3>
              <Badge variant="secondary">{pendingTasks.length}</Badge>
            </div>
            <AnimatePresence>
              {pendingTasks.length > 0 ? (
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} onEdit={onEdit} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <p>No pending tasks found</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Completed Tasks */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Completed Tasks</h3>
              <Badge variant="secondary">{completedTasks.length}</Badge>
            </div>
            <AnimatePresence>
              {completedTasks.length > 0 ? (
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} onEdit={onEdit} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <p>No completed tasks yet</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
