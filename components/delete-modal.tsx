"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Trash2, AlertTriangle, Calendar } from "lucide-react"

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  emails: any[]
  selectedEmails: string[]
  onDeleteAll: () => void
  onDeleteRead: () => void
  onDeleteUnread: () => void
  onDeleteSelected: (emailIds: string[]) => void
  onDeleteByDateRange?: (emailIds: string[]) => void
}

export function DeleteModal({
  isOpen,
  onClose,
  emails,
  selectedEmails,
  onDeleteAll,
  onDeleteRead,
  onDeleteUnread,
  onDeleteSelected,
  onDeleteByDateRange,
}: DeleteModalProps) {
  const [deleteOption, setDeleteOption] = useState("all")
  const [customSelectedEmails, setCustomSelectedEmails] = useState<string[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleCustomEmailToggle = (emailId: string) => {
    setCustomSelectedEmails((prev) =>
      prev.includes(emailId) ? prev.filter((id) => id !== emailId) : [...prev, emailId],
    )
  }

  const getEmailsByDateRange = () => {
    if (!startDate || !endDate) return []
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999) // Include the entire end date
    
    // Debug logging
    console.log('Date range filter:', {
      startDate,
      endDate,
      start: start.toISOString(),
      end: end.toISOString(),
      emailDates: emails.map(email => ({
        id: email.id,
        timestamp: new Date(email.timestamp).toISOString(),
        subject: email.subject
      }))
    })
    
    return emails.filter((email) => {
      const emailDate = new Date(email.timestamp)
      const isInRange = emailDate >= start && emailDate <= end
      console.log(`Email ${email.id} (${emailDate.toISOString()}): ${isInRange ? 'INCLUDED' : 'EXCLUDED'}`)
      return isInRange
    })
  }

  const handleDelete = () => {
    switch (deleteOption) {
      case "all":
        onDeleteAll()
        break
      case "read":
        onDeleteRead()
        break
      case "unread":
        onDeleteUnread()
        break
      case "custom":
        onDeleteSelected(customSelectedEmails)
        break
      case "dateRange":
        const emailsInRange = getEmailsByDateRange()
        const emailIds = emailsInRange.map(email => email.id)
        if (onDeleteByDateRange) {
          onDeleteByDateRange(emailIds)
        } else {
          onDeleteSelected(emailIds)
        }
        break
    }
    onClose()
    setCustomSelectedEmails([])
    setStartDate("")
    setEndDate("")
  }

  const getDeleteCount = () => {
    switch (deleteOption) {
      case "all":
        return emails.length
      case "read":
        return emails.filter((email) => email.isRead).length
      case "unread":
        return emails.filter((email) => !email.isRead).length
      case "custom":
        return customSelectedEmails.length
      case "dateRange":
        return getEmailsByDateRange().length
      default:
        return 0
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            Delete Emails
          </DialogTitle>
          <DialogDescription>Choose which emails you want to delete. This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          <RadioGroup value={deleteOption} onValueChange={setDeleteOption}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="flex-1">
                Delete all emails ({emails.length} emails)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="read" id="read" />
              <Label htmlFor="read" className="flex-1">
                Delete read emails ({emails.filter((email) => email.isRead).length} emails)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unread" id="unread" />
              <Label htmlFor="unread" className="flex-1">
                Delete unread emails ({emails.filter((email) => !email.isRead).length} emails)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="flex-1">
                Custom selection
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dateRange" id="dateRange" />
              <Label htmlFor="dateRange" className="flex-1">
                Delete by date range ({getEmailsByDateRange().length} emails)
              </Label>
            </div>
          </RadioGroup>

          {deleteOption === "custom" && (
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {emails.map((email) => (
                  <div key={email.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={email.id}
                      checked={customSelectedEmails.includes(email.id)}
                      onCheckedChange={() => handleCustomEmailToggle(email.id)}
                    />
                    <Label htmlFor={email.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{email.sender.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{email.subject}</div>
                        </div>
                        <div className="text-xs text-muted-foreground ml-2">{email.isRead ? "Read" : "Unread"}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {deleteOption === "dateRange" && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Select date range</span>
              </div>
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                💡 Tip: Mock emails range from today back to 4 months ago. Try selecting dates from the past few months.
              </div>
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Quick presets:</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date()
                      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                      setStartDate(lastWeek.toISOString().split('T')[0])
                      setEndDate(today.toISOString().split('T')[0])
                    }}
                  >
                    Last 7 days
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date()
                      const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                      setStartDate(lastMonth.toISOString().split('T')[0])
                      setEndDate(today.toISOString().split('T')[0])
                    }}
                  >
                    Last 30 days
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date()
                      const threeMonthsAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
                      setStartDate(threeMonthsAgo.toISOString().split('T')[0])
                      setEndDate(today.toISOString().split('T')[0])
                    }}
                  >
                    Last 3 months
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm">From date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value
                      const today = new Date().toISOString().split('T')[0]
                      if (selectedDate <= today) {
                        setStartDate(selectedDate)
                      }
                    }}
                    className="w-full"
                    max={new Date().toISOString().split('T')[0]}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm">To date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value
                      const today = new Date().toISOString().split('T')[0]
                      if (selectedDate <= today) {
                        setEndDate(selectedDate)
                      }
                    }}
                    className="w-full"
                    max={new Date().toISOString().split('T')[0]}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>
              {startDate && endDate && getEmailsByDateRange().length > 0 && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Found {getEmailsByDateRange().length} email{getEmailsByDateRange().length !== 1 ? 's' : ''} in the selected date range
                  </div>
                </div>
              )}
              {startDate && endDate && getEmailsByDateRange().length === 0 && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    No emails found in the selected date range
                  </div>
                </div>
              )}
            </div>
          )}

          {getDeleteCount() > 0 && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">
                You are about to delete {getDeleteCount()} email{getDeleteCount() !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={
              (deleteOption === "custom" && customSelectedEmails.length === 0) ||
              (deleteOption === "dateRange" && (!startDate || !endDate || getEmailsByDateRange().length === 0))
            }
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete {getDeleteCount()} Email{getDeleteCount() !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
