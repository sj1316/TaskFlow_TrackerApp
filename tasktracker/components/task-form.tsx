"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "@/lib/types"

interface TaskFormProps {
  task?: Task
  onSubmit: (taskData: Omit<Task, "id" | "createdAt" | "status">) => Promise<boolean>
  onCancel?: () => void
  isEditing?: boolean
}

export function TaskForm({ task, onSubmit, onCancel, isEditing = false }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    category: task?.category || "",
    dueDate: task?.dueDate || new Date().toISOString().split('T')[0],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const validateForm = () => {
    setError("")
    if (!formData.title.trim()) {
      setError("Title is required")
      return false
    }
    if (!formData.dueDate) {
      setError("Due date is required")
      return false
    }
    
    // Check if due date is not in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(formData.dueDate)
    if (selectedDate < today) {
      setError("Due date cannot be in the past")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const success = await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority as "low" | "medium" | "high",
        category: formData.category.trim(),
        dueDate: formData.dueDate,
      })

      if (success) {
        if (!isEditing) {
          setFormData({
            title: "",
            description: "",
            priority: "medium",
            category: "",
            dueDate: new Date().toISOString().split('T')[0],
          })
        }
        onCancel?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Task" : "Create New Task"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-destructive text-sm mt-2">{error}</div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting || !formData.title.trim() || !formData.dueDate}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
