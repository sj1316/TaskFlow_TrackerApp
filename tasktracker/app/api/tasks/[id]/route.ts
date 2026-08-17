import { type NextRequest, NextResponse } from "next/server"
import { taskStore } from "@/lib/task-store"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const task = taskStore.getTask(userId, params.id)
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const body = await request.json()
    const updatedTask = taskStore.updateTask(userId, params.id, body)

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const deleted = taskStore.deleteTask(userId, params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
