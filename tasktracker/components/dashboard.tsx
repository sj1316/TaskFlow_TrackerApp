"use client"

import { motion } from "framer-motion"
import { StatsCards } from "./stats-cards"
import { WeeklyChart } from "./weekly-chart"
import { ProductivityChart } from "./productivity-chart"
import { TaskSuggestions } from "./task-suggestions"
import { useTasks } from "@/hooks/use-tasks"

export function Dashboard() {
  const { stats, weeklyStats, suggestions, loading } = useTasks()

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground">Track your productivity and manage your tasks efficiently</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <StatsCards stats={stats} loading={loading} />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <WeeklyChart data={weeklyStats} loading={loading} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <ProductivityChart data={weeklyStats} loading={loading} />
        </motion.div>
      </div>

      {/* Suggestions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <TaskSuggestions suggestions={suggestions} />
      </motion.div>
    </div>
  )
}
