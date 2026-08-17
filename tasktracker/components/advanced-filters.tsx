"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, ChevronDown, CalendarDays, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export interface FilterOptions {
  search: string
  status: "all" | "pending" | "completed"
  priority: "all" | "low" | "medium" | "high"
  sortBy: "dueDate" | "priority" | "created" | "title"
  sortOrder: "asc" | "desc"
  dateRange: {
    from?: Date
    to?: Date
  }
  showOverdue: boolean
}

interface AdvancedFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  taskCount: number
}

export function AdvancedFilters({ filters, onFiltersChange, taskCount }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      priority: "all",
      sortBy: "dueDate",
      sortOrder: "asc",
      dateRange: {},
      showOverdue: false,
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.showOverdue

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
                {hasActiveFilters && <Badge variant="secondary">Active</Badge>}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{taskCount} tasks</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Tasks</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by title or description..."
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={filters.priority} onValueChange={(value) => updateFilter("priority", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sort Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dueDate">Due Date</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="created">Created Date</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Select value={filters.sortOrder} onValueChange={(value) => updateFilter("sortOrder", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Due Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? format(filters.dateRange.from, "PPP") : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) => updateFilter("dateRange", { ...filters.dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {filters.dateRange.to ? format(filters.dateRange.to, "PPP") : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) => updateFilter("dateRange", { ...filters.dateRange, to: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <Label>Additional Options</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showOverdue"
                    checked={filters.showOverdue}
                    onCheckedChange={(checked) => updateFilter("showOverdue", checked)}
                  />
                  <Label htmlFor="showOverdue" className="text-sm font-normal">
                    Show only overdue tasks
                  </Label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={clearFilters} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
