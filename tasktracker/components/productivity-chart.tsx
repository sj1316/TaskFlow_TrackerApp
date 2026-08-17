"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import type { WeeklyStats } from "@/lib/types"

interface ProductivityChartProps {
  data: WeeklyStats[]
  loading?: boolean
}

export function ProductivityChart({ data, loading = false }: ProductivityChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productivity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  // Calculate completion rate for each day
  const productivityData = data.map((day) => ({
    ...day,
    completionRate: day.created > 0 ? Math.round((day.completed / day.created) * 100) : 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Trend</CardTitle>
        <p className="text-sm text-muted-foreground">Daily completion rate percentage</p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            completionRate: {
              label: "Completion Rate (%)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={productivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="completionRate"
                stroke="var(--color-completionRate)"
                strokeWidth={3}
                dot={{ fill: "var(--color-completionRate)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
