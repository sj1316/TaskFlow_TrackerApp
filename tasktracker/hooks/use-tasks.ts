"use client"

import { useState, useEffect } from "react"
import type { Task, TaskStats, WeeklyStats, TaskSuggestion } from "@/lib/types"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, pending: 0, overdue: 0 })
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([])
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([])
  const [loading, setLoading] = useState(true)

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token")
    const userId = localStorage.getItem("user_id")
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-user-id": userId || ""
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks", {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(Array.isArray(data) ? data : [])
      } else {
        throw new Error('Failed to fetch tasks')
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
      setTasks([])
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats", {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setWeeklyStats(data.weeklyStats)
        setSuggestions(data.suggestions)
      } else {
        throw new Error('Failed to fetch stats')
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      setStats({ total: 0, completed: 0, pending: 0, overdue: 0 })
      setWeeklyStats([])
      setSuggestions([])
    }
  }

  const createTask = async (taskData: Omit<Task, "id" | "createdAt" | "status">) => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error('Please log in to create tasks')
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create task')
      }

      await Promise.all([fetchTasks(), fetchStats()])
      return true
    } catch (error) {
      console.error("Failed to create task:", error)
      throw error
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      await Promise.all([fetchTasks(), fetchStats()])
      return true
    } catch (error) {
      console.error("Failed to update task:", error)
      return false
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      await Promise.all([fetchTasks(), fetchStats()])
      return true
    } catch (error) {
      console.error("Failed to delete task:", error)
      return false
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      const loadData = async () => {
        setLoading(true)
        await Promise.all([fetchTasks(), fetchStats()])
        setLoading(false)
      }
      loadData()
    } else {
      setLoading(false)
    }
  }, [])

  return {
    tasks,
    stats,
    weeklyStats,
    suggestions,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: () => Promise.all([fetchTasks(), fetchStats()]),
  }
}
