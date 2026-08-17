"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { TaskForm } from "@/components/task-form"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"
import type { Task } from "@/lib/types"

export default function NewTaskPage() {
  const router = useRouter()
  const { createTask } = useTasks()

  const handleSubmit = async (taskData: Omit<Task, "id" | "createdAt" | "status">) => {
    const success = await createTask(taskData)
    if (success) {
      router.push("/tasks")
    }
    return success
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ProtectedRoute>
      <LayoutWrapper>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={handleCancel} className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-balance">Create New Task</h1>
            <p className="text-muted-foreground">Add a new task to your workflow</p>
          </div>

          <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </motion.div>
      </LayoutWrapper>
    </ProtectedRoute>
  )
}
