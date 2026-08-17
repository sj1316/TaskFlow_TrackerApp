export interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  status: "pending" | "completed"
  category?: string
  dueDate: string
  createdAt: string
  completedAt?: string
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
}

export interface WeeklyStats {
  day: string
  completed: number
  created: number
}

export interface TaskSuggestion {
  id: string
  type: "priority" | "overdue" | "workload"
  message: string
  taskId?: string
}

export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  token?: string
  message?: string
}

export interface AuthCheckResponse {
  authenticated: boolean
  user?: AuthUser
}
