import type { Task, TaskStats, WeeklyStats, TaskSuggestion } from "./types"
import { TaskModel } from "./models/task"
import dbConnect from "./db"
import type { Types } from 'mongoose'

interface TaskDocument extends Omit<Task, 'id'> {
  _id: Types.ObjectId;
  userId: string;
}

export const taskStore = {
  getTasks: async (userId: string): Promise<Task[]> => {
    await dbConnect()
    const tasks = await TaskModel.find({ userId }).lean<TaskDocument[]>()
    return tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      completedAt: task.completedAt
    }))
  },

  getTask: async (userId: string, id: string): Promise<Task | null> => {
    await dbConnect()
    const task = await TaskModel.findOne({ _id: id, userId }).lean<TaskDocument>()
    if (!task) return null
    
    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      completedAt: task.completedAt
    }
  },

  createTask: async (userId: string, taskData: Omit<Task, "id" | "createdAt">): Promise<Task> => {
    await dbConnect()
    const newTask = await TaskModel.create({
      ...taskData,
      userId,
      createdAt: new Date().toISOString()
    })

    const task = newTask.toObject() as TaskDocument
    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      completedAt: task.completedAt
    }
  },

  updateTask: async (userId: string, id: string, updates: Partial<Task>): Promise<Task | null> => {
    await dbConnect()
    const task = await TaskModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true }
    ).lean<TaskDocument>()
    
    if (!task) return null
    
    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      completedAt: task.completedAt
    }
  },

  deleteTask: async (userId: string, id: string): Promise<boolean> => {
    await dbConnect()
    const result = await TaskModel.deleteOne({ _id: id, userId })
    return result.deletedCount === 1
  },

  getStats: async (userId: string): Promise<TaskStats> => {
    await dbConnect()
    const now = new Date()
    
    const [total, completed, pending, overdue] = await Promise.all([
      TaskModel.countDocuments({ userId }),
      TaskModel.countDocuments({ userId, status: "completed" }),
      TaskModel.countDocuments({ userId, status: "pending" }),
      TaskModel.countDocuments({
        userId,
        status: "pending",
        dueDate: { $lt: now.toISOString() }
      })
    ])

    return { total, completed, pending, overdue }
  },

  getWeeklyStats: async (userId: string): Promise<WeeklyStats[]> => {
    await dbConnect()
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1))
    
    const weeklyStats = await Promise.all(
      days.map(async (day, index) => {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + index)
        const nextDate = new Date(date)
        nextDate.setDate(date.getDate() + 1)
        
        const dateStr = date.toISOString().split("T")[0]
        const nextDateStr = nextDate.toISOString().split("T")[0]

        const [completed, created] = await Promise.all([
          TaskModel.countDocuments({
            userId,
            completedAt: { $gte: dateStr, $lt: nextDateStr }
          }),
          TaskModel.countDocuments({
            userId,
            createdAt: { $gte: dateStr, $lt: nextDateStr }
          })
        ])

        return { day, completed, created }
      })
    )

    return weeklyStats
  },

  getSuggestions: async (userId: string): Promise<TaskSuggestion[]> => {
    await dbConnect()
    const suggestions: TaskSuggestion[] = []
    const now = new Date()

    const [overdueTasks, highPriorityPending, pendingTasks] = await Promise.all([
      TaskModel.countDocuments({
        userId,
        status: "pending",
        dueDate: { $lt: now.toISOString() }
      }),
      TaskModel.countDocuments({
        userId,
        status: "pending",
        priority: "high"
      }),
      TaskModel.countDocuments({
        userId,
        status: "pending"
      })
    ])

    if (overdueTasks > 0) {
      suggestions.push({
        id: "overdue",
        type: "overdue",
        message: `You have ${overdueTasks} overdue task${
          overdueTasks > 1 ? "s" : ""
        }. Consider prioritizing them.`,
      })
    }

    if (highPriorityPending > 0) {
      suggestions.push({
        id: "priority",
        type: "priority",
        message: `Focus on ${highPriorityPending} high-priority task${
          highPriorityPending > 1 ? "s" : ""
        } first.`,
      })
    }

    if (pendingTasks > 10) {
      suggestions.push({
        id: "workload",
        type: "workload",
        message: "Consider breaking down large tasks or extending deadlines to manage your workload better.",
      })
    }

    return suggestions
  },
}
