"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Filter, CalendarIcon, User } from "lucide-react"
import { format } from "date-fns"

interface BulkDeleteFiltersProps {
  onApplyFilters: (filters: any) => void
}

export function BulkDeleteFilters({ onApplyFilters }: BulkDeleteFiltersProps) {
  const [filters, setFilters] = useState({
    sender: "",
    dateRange: "all",
    customDate: null as Date | null,
    readStatus: "all",
    hasAttachment: "all",
  })

  const [showCalendar, setShowCalendar] = useState(false)

  const handleApplyFilters = () => {
    onApplyFilters(filters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      sender: "",
      dateRange: "all",
      customDate: null,
      readStatus: "all",
      hasAttachment: "all",
    }
    setFilters(clearedFilters)
    onApplyFilters(clearedFilters)
  }

  const hasActiveFilters =
    filters.sender || filters.dateRange !== "all" || filters.readStatus !== "all" || filters.hasAttachment !== "all"

  return (
    <div className="p-4 bg-muted/30 border-b border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Bulk Delete Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Filters active
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sender Filter */}
        <div className="space-y-2">
          <Label htmlFor="sender" className="text-xs text-muted-foreground">
            From sender
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="sender"
              placeholder="Enter email or name"
              value={filters.sender}
              onChange={(e) => setFilters((prev) => ({ ...prev, sender: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Date range</Label>
          <Select
            value={filters.dateRange}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="older">Older than 30 days</SelectItem>
              <SelectItem value="custom">Custom date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Picker */}
        {filters.dateRange === "custom" && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Select date</Label>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.customDate ? format(filters.customDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.customDate}
                  onSelect={(date) => {
                    setFilters((prev) => ({ ...prev, customDate: date }))
                    setShowCalendar(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Read Status Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Read status</Label>
          <Select
            value={filters.readStatus}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, readStatus: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All emails</SelectItem>
              <SelectItem value="read">Read only</SelectItem>
              <SelectItem value="unread">Unread only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Attachment Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Attachments</Label>
          <Select
            value={filters.hasAttachment}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, hasAttachment: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All emails</SelectItem>
              <SelectItem value="with">With attachments</SelectItem>
              <SelectItem value="without">Without attachments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={handleApplyFilters} className="gap-2">
          <Filter className="w-4 h-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
