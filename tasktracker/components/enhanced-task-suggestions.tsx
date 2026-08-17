"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  AlertTriangle,
  Target,
  BarChart3,
  Lightbulb,
  ChevronDown,
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle,
} from "lucide-react"
import type { TaskSuggestion, Task, TaskStats } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EnhancedTaskSuggestionsProps {
  suggestions: TaskSuggestion[]
  tasks: Task[]
  stats: TaskStats
  onTaskUpdate?: (id: string, updates: Partial<Task>) => Promise<boolean>
}

export function EnhancedTaskSuggestions({ suggestions, tasks, stats, onTaskUpdate }: EnhancedTaskSuggestionsProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["suggestions"])
  const [aiSuggestions, setAiSuggestions] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const lastFetchTime = useRef<number>(0)
  const lastTasksHash = useRef<string>("")

  // Function to generate a hash of tasks state
  const getTasksHash = useCallback(() => {
    const relevantData = tasks.map(task => ({
      id: task.id,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
    }));
    return JSON.stringify(relevantData);
  }, [tasks]);

  // Debounced fetch with conditions
  useEffect(() => {
    const currentHash = getTasksHash();
    const now = Date.now();
    const FETCH_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown

    const shouldFetch = 
      // Only fetch if the tasks have meaningfully changed
      currentHash !== lastTasksHash.current &&
      // And enough time has passed since last fetch
      (now - lastFetchTime.current > FETCH_COOLDOWN);

    if (shouldFetch) {
      lastTasksHash.current = currentHash;
      lastFetchTime.current = now;
      fetchAISuggestions();
    }
  }, [tasks, getTasksHash])

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token")
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }

  // Manual refresh function for user-initiated refreshes
  const refreshSuggestions = useCallback(async () => {
    lastFetchTime.current = Date.now();
    lastTasksHash.current = getTasksHash();
    await fetchAISuggestions();
  }, [getTasksHash]);

  const fetchAISuggestions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/tasks/analyze', {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }
      
      const data = await response.json()
      if (data.suggestions) {
        setAiSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error('Error fetching AI suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  // Generate additional insights
  const overdueTasks = tasks.filter((task) => task.status === "pending" && new Date(task.dueDate) < new Date())
  const todayTasks = tasks.filter((task) => {
    const today = new Date().toDateString()
    return task.status === "pending" && new Date(task.dueDate).toDateString() === today
  })
  const highPriorityPending = tasks.filter((task) => task.status === "pending" && task.priority === "high")

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  const getIcon = (type: TaskSuggestion["type"]) => {
    switch (type) {
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      case "priority":
        return <Target className="h-4 w-4" />
      case "workload":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getVariant = (type: TaskSuggestion["type"]) => {
    switch (type) {
      case "overdue":
        return "destructive"
      case "priority":
        return "default"
      case "workload":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleQuickAction = async (action: string, taskId?: string) => {
    if (!onTaskUpdate || !taskId) return

    switch (action) {
      case "complete":
        await onTaskUpdate(taskId, { status: "completed", completedAt: new Date().toISOString() })
        break
      case "high-priority":
        await onTaskUpdate(taskId, { priority: "high" })
        break
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Suggestions */}
      <Card>
        <Collapsible open={expandedSections.includes("suggestions")} onOpenChange={() => toggleSection("suggestions")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Smart Suggestions
                    {suggestions.length > 0 && <Badge variant="secondary">{suggestions.length}</Badge>}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      refreshSuggestions();
                    }}
                    disabled={isLoading || Date.now() - lastFetchTime.current < 60000}
                  >
                    <span className="flex items-center gap-2">
                      {isLoading ? "Analyzing..." : "Refresh"}
                    </span>
                  </Button>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedSections.includes("suggestions") && "rotate-180",
                  )}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-6 text-muted-foreground">
                  <div className="animate-spin h-12 w-12 mx-auto mb-3 border-4 border-primary border-t-transparent rounded-full" />
                  <p className="font-medium">Analyzing your tasks...</p>
                  <p className="text-sm mt-1">Using AI to generate personalized suggestions</p>
                </div>
              ) : suggestions.length === 0 && !aiSuggestions ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                  <p className="font-medium">Great job! No suggestions at the moment.</p>
                  <p className="text-sm mt-1">Keep up the excellent work!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Regular suggestions */}
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <Badge variant={getVariant(suggestion.type)} className="mt-0.5">
                          {getIcon(suggestion.type)}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm text-pretty">{suggestion.message}</p>
                          {suggestion.taskId && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickAction("complete", suggestion.taskId)}
                              >
                                Mark Complete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickAction("high-priority", suggestion.taskId)}
                              >
                                Set High Priority
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* AI-powered suggestions */}
                  {aiSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: suggestions.length * 0.1 }}
                    >
                      <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors mt-4">
                        <Badge variant="default" className="mt-0.5">
                          <Lightbulb className="h-4 w-4" />
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-2">AI Suggestions</p>
                          <div className="text-sm text-pretty whitespace-pre-line">
                            {aiSuggestions}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Today's Focus */}
      {todayTasks.length > 0 && (
        <Card>
          <Collapsible open={expandedSections.includes("today")} onOpenChange={() => toggleSection("today")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Focus
                    <Badge variant="secondary">{todayTasks.length}</Badge>
                  </CardTitle>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", expandedSections.includes("today") && "rotate-180")}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent>
                <div className="space-y-2">
                  {todayTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                        <span className="text-sm">{task.title}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleQuickAction("complete", task.id)}
                        className="h-6 px-2"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Productivity Insights */}
      <Card>
        <Collapsible open={expandedSections.includes("insights")} onOpenChange={() => toggleSection("insights")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Productivity Insights
                </CardTitle>
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", expandedSections.includes("insights") && "rotate-180")}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-4">
              {/* Completion Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm text-muted-foreground">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-lg font-bold text-emerald-600">{stats.completed}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-lg font-bold text-blue-600">{stats.pending}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>

              {/* Insights */}
              <div className="space-y-2 text-sm">
                {completionRate >= 80 && (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Excellent productivity! You're on fire!</span>
                  </div>
                )}
                {overdueTasks.length === 0 && stats.pending > 0 && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span>Great time management - no overdue tasks!</span>
                  </div>
                )}
                {highPriorityPending.length === 0 && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Target className="h-4 w-4" />
                    <span>All high-priority tasks handled!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
}
