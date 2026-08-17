import { type NextRequest, NextResponse } from "next/server"
import { taskStore } from "@/lib/task-store"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const tasks = await taskStore.getTasks(userId)
    return NextResponse.json(Array.isArray(tasks) ? tasks : [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, priority, category, dueDate } = body

    if (!title || !priority || !dueDate) {
      return NextResponse.json({ error: "Missing required fields: title, priority, dueDate" }, { status: 400 })
    }

    // Validate due date
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(dueDate)
    if (selectedDate < today) {
      return NextResponse.json({ error: "Due date cannot be in the past" }, { status: 400 })
    }

    const newTask = taskStore.createTask(userId, {
      title,
      description: description || "",
      priority,
      category: category || "other",
      status: "pending",
      dueDate,
    })

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
