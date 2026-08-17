"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import type { WeeklyStats } from "@/lib/types"

interface WeeklyChartProps {
  data: WeeklyStats[]
  loading?: boolean
}

export function WeeklyChart({ data, loading = false }: WeeklyChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Tasks completed and created each day this week</p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            completed: {
              label: "Completed",
              color: "hsl(var(--chart-1))",
            },
            created: {
              label: "Created",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="completed" fill="var(--color-completed)" name="Completed" radius={[2, 2, 0, 0]} />
              <Bar dataKey="created" fill="var(--color-created)" name="Created" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
