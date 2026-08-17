"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import { AdvancedFilters, type FilterOptions } from "@/components/advanced-filters"
import { EnhancedTaskSuggestions } from "@/components/enhanced-task-suggestions"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProtectedRoute } from "@/components/protected-route"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTasks } from "@/hooks/use-tasks"
import type { Task } from "@/lib/types"

export default function TasksPage() {
  const { tasks, stats, suggestions, updateTask, deleteTask, createTask, loading } = useTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: "all",
    priority: "all",
    sortBy: "dueDate",
    sortOrder: "asc",
    dateRange: {},
    showOverdue: false,
  })

  // Apply filters to tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Search filter
      const matchesSearch =
        !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase())

      // Status filter
      const matchesStatus = filters.status === "all" || task.status === filters.status

      // Priority filter
      const matchesPriority = filters.priority === "all" || task.priority === filters.priority

      // Date range filter
      const taskDate = new Date(task.dueDate)
      const matchesDateRange =
        (!filters.dateRange.from || taskDate >= filters.dateRange.from) &&
        (!filters.dateRange.to || taskDate <= filters.dateRange.to)

      // Overdue filter
      const isOverdue = task.status === "pending" && new Date(task.dueDate) < new Date()
      const matchesOverdue = !filters.showOverdue || isOverdue

      return matchesSearch && matchesStatus && matchesPriority && matchesDateRange && matchesOverdue
    })
    .sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case "dueDate":
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          break
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority]
          break
        case "created":
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
      }

      return filters.sortOrder === "desc" ? -comparison : comparison
    })

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleUpdate = async (taskData: Omit<Task, "id" | "createdAt" | "status">) => {
    if (!editingTask) return false

    const success = await updateTask(editingTask.id, taskData)
    if (success) {
      setEditingTask(null)
    }
    return success
  }

  const handleCreateNew = () => {
    setShowCreateForm(true)
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <LayoutWrapper>
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-64 bg-muted rounded animate-pulse" />
          </div>
        </LayoutWrapper>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <LayoutWrapper>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Enhanced Suggestions */}
          <EnhancedTaskSuggestions suggestions={suggestions} tasks={tasks} stats={stats} onTaskUpdate={updateTask} />

          {/* Advanced Filters */}
          <AdvancedFilters filters={filters} onFiltersChange={setFilters} taskCount={filteredTasks.length} />

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onEdit={handleEdit}
            onCreateNew={handleCreateNew}
          />
        </motion.div>

        {/* Edit Task Dialog */}
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <TaskForm task={editingTask} onSubmit={handleUpdate} onCancel={() => setEditingTask(null)} isEditing />
            )}
          </DialogContent>
        </Dialog>

        {/* Create Task Dialog */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm 
              onSubmit={async (taskData) => {
                try {
                  const success = await createTask(taskData);
                  if (success) {
                    setShowCreateForm(false);
                  }
                  return success;
                } catch (error) {
                  console.error('Error creating task:', error);
                  return false;
                }
              }} 
              onCancel={() => setShowCreateForm(false)} 
            />
          </DialogContent>
        </Dialog>
      </LayoutWrapper>
    </ProtectedRoute>
  )
}
