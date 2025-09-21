"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Paperclip, Archive, Trash2, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Email {
  id: string
  sender: {
    name: string
    email: string
    avatar?: string
  }
  subject: string
  preview: string
  timestamp: Date
  isRead: boolean
  isStarred: boolean
  hasAttachment: boolean
  isImportant: boolean
}

interface EmailListProps {
  emails: Email[]
  selectedEmails: string[]
  onEmailSelect: (emailId: string) => void
  onEmailClick: (email: Email) => void
  onSelectAll: (checked: boolean) => void
}

export function EmailList({ emails, selectedEmails, onEmailSelect, onEmailClick, onSelectAll }: EmailListProps) {
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null)

  const allSelected = emails.length > 0 && selectedEmails.length === emails.length
  const someSelected = selectedEmails.length > 0 && selectedEmails.length < emails.length

  return (
    <div className="space-y-2">
      {/* Header with select all */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
        <Checkbox
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected
          }}
          onCheckedChange={onSelectAll}
        />
        <span className="text-sm text-muted-foreground">
          {selectedEmails.length > 0 ? `${selectedEmails.length} selected` : `${emails.length} emails`}
        </span>
      </div>

      {/* Email List */}
      <div className="space-y-1">
        {emails.map((email) => (
          <div
            key={email.id}
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              selectedEmails.includes(email.id) ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50"
            } ${!email.isRead ? "bg-background" : "bg-muted/20"}`}
            onMouseEnter={() => setHoveredEmail(email.id)}
            onMouseLeave={() => setHoveredEmail(null)}
            onClick={() => onEmailClick(email)}
          >
            {/* Checkbox */}
            <Checkbox
              checked={selectedEmails.includes(email.id)}
              onCheckedChange={() => onEmailSelect(email.id)}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Star */}
            <button
              className={`p-1 rounded transition-colors ${
                email.isStarred ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"
              }`}
              onClick={(e) => {
                e.stopPropagation()
                // Handle star toggle
              }}
            >
              <Star className={`w-4 h-4 ${email.isStarred ? "fill-current" : ""}`} />
            </button>

            {/* Sender Avatar & Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={email.sender.avatar || "/placeholder.svg"} alt={email.sender.name} />
                <AvatarFallback className="text-xs">
                  {email.sender.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm truncate ${!email.isRead ? "font-semibold" : "font-normal"}`}>
                    {email.sender.name}
                  </span>
                  {email.isImportant && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      Important
                    </Badge>
                  )}
                  {email.hasAttachment && <Paperclip className="w-3 h-3 text-muted-foreground" />}
                </div>

                <div className="space-y-1">
                  <p className={`text-sm truncate ${!email.isRead ? "font-medium" : "font-normal"}`}>{email.subject}</p>
                  <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
                </div>
              </div>
            </div>

            {/* Timestamp & Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(email.timestamp, { addSuffix: true })}
              </span>

              {/* Quick Actions (shown on hover) */}
              {hoveredEmail === email.id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle archive
                    }}
                  >
                    <Archive className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle delete
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle more actions
                    }}
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {emails.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Archive className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No emails found</p>
            <p className="text-sm text-muted-foreground">Your inbox is empty</p>
          </div>
        </div>
      )}
    </div>
  )
}
