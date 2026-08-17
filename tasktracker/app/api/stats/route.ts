import { NextResponse, type NextRequest } from "next/server"
import { taskStore } from "@/lib/task-store"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const [stats, weeklyStats, suggestions] = await Promise.all([
      taskStore.getStats(userId),
      taskStore.getWeeklyStats(userId),
      taskStore.getSuggestions(userId)
    ])

    return NextResponse.json({
      stats,
      weeklyStats,
      suggestions: Array.isArray(suggestions) ? suggestions : [],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
