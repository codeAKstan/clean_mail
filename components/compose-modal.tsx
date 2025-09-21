"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Paperclip,
  ImageIcon,
  Smile,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  List,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ComposeModalProps {
  isOpen: boolean
  onClose: () => void
  replyTo?: any
  forwardEmail?: any
}

export function ComposeModal({ isOpen, onClose, replyTo, forwardEmail }: ComposeModalProps) {
  const [to, setTo] = useState(replyTo?.sender.email || "")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState(
    replyTo ? `Re: ${replyTo.subject}` : forwardEmail ? `Fwd: ${forwardEmail.subject}` : "",
  )
  const [body, setBody] = useState("")
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [attachments, setAttachments] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)

  const { toast } = useToast()

  const handleSend = async () => {
    if (!to || !subject || !body) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Email sent",
      description: "Your email has been sent successfully",
    })

    setIsSending(false)
    onClose()

    // Reset form
    setTo("")
    setCc("")
    setBcc("")
    setSubject("")
    setBody("")
    setAttachments([])
  }

  const handleAttachment = () => {
    // Simulate file attachment
    const fileName = `document_${Date.now()}.pdf`
    setAttachments((prev) => [...prev, fileName])
    toast({
      title: "File attached",
      description: `${fileName} has been attached`,
    })
  }

  const removeAttachment = (fileName: string) => {
    setAttachments((prev) => prev.filter((name) => name !== fileName))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{replyTo ? "Reply" : forwardEmail ? "Forward" : "Compose Email"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Recipients */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="to" className="w-12 text-right">
                To
              </Label>
              <Input
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowCc(!showCc)} className="text-xs">
                  Cc
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowBcc(!showBcc)} className="text-xs">
                  Bcc
                </Button>
              </div>
            </div>

            {showCc && (
              <div className="flex items-center gap-2">
                <Label htmlFor="cc" className="w-12 text-right">
                  Cc
                </Label>
                <Input
                  id="cc"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="cc@example.com"
                  className="flex-1"
                />
              </div>
            )}

            {showBcc && (
              <div className="flex items-center gap-2">
                <Label htmlFor="bcc" className="w-12 text-right">
                  Bcc
                </Label>
                <Input
                  id="bcc"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="bcc@example.com"
                  className="flex-1"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Label htmlFor="subject" className="w-12 text-right">
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="flex-1"
              />
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 p-2 border border-border rounded-lg bg-muted/30">
            <Button variant="ghost" size="sm">
              <Bold className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Underline className="w-4 h-4" />
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button variant="ghost" size="sm">
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="w-4 h-4" />
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button variant="ghost" size="sm" onClick={handleAttachment}>
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Attachments</Label>
              <div className="flex flex-wrap gap-2">
                {attachments.map((fileName) => (
                  <Badge key={fileName} variant="secondary" className="gap-2">
                    <Paperclip className="w-3 h-3" />
                    {fileName}
                    <button onClick={() => removeAttachment(fileName)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Email Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email here..."
              className="min-h-[300px] resize-none"
            />
          </div>

          {/* Forward/Reply Context */}
          {(replyTo || forwardEmail) && (
            <div className="border-l-4 border-muted pl-4 space-y-2">
              <p className="text-sm text-muted-foreground">{replyTo ? "Replying to:" : "Forwarding:"}</p>
              <div className="text-sm space-y-1">
                <p>
                  <strong>From:</strong> {(replyTo || forwardEmail).sender.name}
                </p>
                <p>
                  <strong>Subject:</strong> {(replyTo || forwardEmail).subject}
                </p>
                <p className="text-muted-foreground line-clamp-3">{(replyTo || forwardEmail).preview}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Save Draft
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={isSending} className="gap-2">
              <Send className="w-4 h-4" />
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
