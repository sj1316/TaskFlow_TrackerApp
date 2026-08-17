"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProtectedRoute } from "@/components/protected-route"
import { WeeklyChart } from "@/components/weekly-chart"
import { ProductivityChart } from "@/components/productivity-chart"
import { Trophy, Target, Calendar, TrendingUp } from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"

export default function SummaryPage() {
  const { stats, weeklyStats, loading } = useTasks()

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
  const weeklyCompleted = weeklyStats.reduce((sum, day) => sum + day.completed, 0)
  const averageDaily = weeklyCompleted / 7

  const getMotivationalMessage = () => {
    if (completionRate >= 80) {
      return {
        message: "Outstanding work! You're crushing your goals!",
        icon: Trophy,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 dark:bg-yellow-950",
      }
    } else if (completionRate >= 60) {
      return {
        message: "Great progress! Keep up the momentum!",
        icon: Target,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-950",
      }
    } else if (completionRate >= 40) {
      return {
        message: "You're on the right track! Stay focused!",
        icon: TrendingUp,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
      }
    } else {
      return {
        message: "Every step counts! Let's build momentum!",
        icon: Calendar,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950",
      }
    }
  }

  const motivation = getMotivationalMessage()

  if (loading) {
    return (
      <ProtectedRoute>
        <LayoutWrapper>
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </LayoutWrapper>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <LayoutWrapper>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">Weekly Summary</h1>
            <p className="text-muted-foreground">Your productivity insights and achievements</p>
          </div>

          {/* Motivational Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${motivation.bgColor}`}>
                    <motivation.icon className={`h-6 w-6 ${motivation.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{motivation.message}</h3>
                    <p className="text-sm text-muted-foreground">
                      You've completed {stats.completed} out of {stats.total} tasks
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {completionRate}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{completionRate}%</span>
                      <Badge variant={completionRate >= 70 ? "default" : "secondary"}>
                        {completionRate >= 70 ? "Excellent" : "Good"}
                      </Badge>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {stats.completed} completed, {stats.pending} pending
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Daily Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{averageDaily.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">Tasks completed per day</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-600">Consistent progress</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{weeklyCompleted}</div>
                    <p className="text-xs text-muted-foreground">Total tasks completed</p>
                    {stats.overdue > 0 && (
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">
                          {stats.overdue} overdue
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <WeeklyChart data={weeklyStats} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <ProductivityChart data={weeklyStats} />
            </motion.div>
          </div>
        </motion.div>
      </LayoutWrapper>
    </ProtectedRoute>
  )
}
