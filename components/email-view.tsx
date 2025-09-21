"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Reply,
  ReplyAll,
  Forward,
  Trash2,
  Archive,
  Star,
  MoreHorizontal,
  ArrowLeft,
  Paperclip,
  Download,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

interface EmailViewProps {
  email: any
  onBack: () => void
  onReply: () => void
  onForward: () => void
  onDelete: () => void
}

export function EmailView({ email, onBack, onReply, onForward, onDelete }: EmailViewProps) {
  const [isStarred, setIsStarred] = useState(email.isStarred)

  const toggleStar = () => {
    setIsStarred(!isStarred)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold">Email</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReply}>
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline" size="sm" onClick={onForward}>
            <Forward className="w-4 h-4 mr-2" />
            Forward
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                <ReplyAll className="mr-2 h-4 w-4" />
                Reply All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleStar}>
                <Star className="mr-2 h-4 w-4" />
                {isStarred ? "Unstar" : "Star"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Email Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-semibold text-balance">{email.subject}</h1>
              <div className="flex items-center gap-2">
                {email.isImportant && <Badge variant="secondary">Important</Badge>}
                <button onClick={toggleStar}>
                  <Star
                    className={`w-5 h-5 ${isStarred ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={email.sender.avatar || "/placeholder.svg"} alt={email.sender.name} />
                  <AvatarFallback>
                    {email.sender.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{email.sender.name}</p>
                  <p className="text-sm text-muted-foreground">{email.sender.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{format(email.timestamp, "PPP 'at' p")}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(email.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Attachments */}
          {email.hasAttachment && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Attachments</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <Paperclip className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Q4_Marketing_Report.pdf</p>
                    <p className="text-xs text-muted-foreground">2.4 MB</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Separator />
            </div>
          )}

          {/* Email Body */}
          <div className="prose prose-sm max-w-none">
            <div className="space-y-4 text-foreground">
              <p>Hi team,</p>
              <p>
                I've attached the latest marketing campaign metrics for Q4. The results look promising and I'd like to
                schedule a meeting to discuss the next steps for our upcoming campaigns.
              </p>
              <p>Key highlights from the report:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Email open rates increased by 23% compared to Q3</li>
                <li>Click-through rates improved by 18%</li>
                <li>Overall ROI exceeded our target by 15%</li>
                <li>Social media engagement grew by 31%</li>
              </ul>
              <p>
                I think we should focus on expanding our most successful campaigns and exploring new channels that
                showed potential. Let me know your availability for a meeting this week.
              </p>
              <p>
                Best regards,
                <br />
                Sarah Johnson
                <br />
                Marketing Director
                <br />
                Company Inc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
