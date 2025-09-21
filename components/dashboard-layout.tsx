"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Mail, Send, FileText, Trash2, Settings, Search, Plus, LogOut, User, Filter, Loader2 } from "lucide-react"
import { EmailList } from "@/components/email-list"
import { BulkActionsToolbar } from "@/components/bulk-actions-toolbar"
import { BulkDeleteFilters } from "@/components/bulk-delete-filters"
import { EmailView } from "@/components/email-view"
import { ComposeModal } from "@/components/compose-modal"
import { DeleteModal } from "@/components/delete-modal"
import { GmailService, GmailEmail } from "@/lib/gmail"
import { useRouter } from "next/navigation"

const mockEmails = [
  {
    id: "1",
    sender: {
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    subject: "Q4 Marketing Campaign Review",
    preview:
      "Hi team, I've attached the latest marketing campaign metrics for Q4. The results look promising and I'd like to schedule a meeting to discuss...",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    isStarred: true,
    hasAttachment: true,
    isImportant: true,
  },
  {
    id: "2",
    sender: {
      name: "GitHub",
      email: "noreply@github.com",
    },
    subject: "Your weekly digest",
    preview:
      "Here's what happened in your repositories this week. You have 3 new pull requests and 5 issues that need attention...",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    isImportant: false,
  },
  {
    id: "3",
    sender: {
      name: "Netflix",
      email: "info@netflix.com",
    },
    subject: "New shows added to your list",
    preview:
      "We've added some new shows to your watchlist based on your viewing history. Check out these recommendations...",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    isImportant: false,
  },
  {
    id: "4",
    sender: {
      name: "John Smith",
      email: "john.smith@client.com",
    },
    subject: "Project deadline update",
    preview:
      "I wanted to reach out regarding the upcoming project deadline. We may need to extend the timeline by a few days due to some unexpected...",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: false,
    isStarred: false,
    hasAttachment: false,
    isImportant: true,
  },
  {
    id: "5",
    sender: {
      name: "LinkedIn",
      email: "messages-noreply@linkedin.com",
    },
    subject: "You have 3 new connection requests",
    preview:
      "People are trying to connect with you on LinkedIn. View and respond to your pending connection requests...",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    isImportant: false,
  },
  {
    id: "6",
    sender: {
      name: "Amazon",
      email: "no-reply@amazon.com",
    },
    subject: "Your order has been shipped",
    preview:
      "Great news! Your recent order has been shipped and is on its way. Track your package using the link below...",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    isImportant: false,
  },
  {
    id: "7",
    sender: {
      name: "Microsoft Teams",
      email: "noreply@teams.microsoft.com",
    },
    subject: "Meeting reminder: Weekly standup",
    preview:
      "This is a reminder that you have a meeting scheduled for tomorrow at 9:00 AM. Please join using the link provided...",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    isRead: false,
    isStarred: true,
    hasAttachment: false,
    isImportant: true,
  },
  {
    id: "8",
    sender: {
      name: "Bank of America",
      email: "alerts@bankofamerica.com",
    },
    subject: "Monthly statement available",
    preview:
      "Your monthly statement for November 2024 is now available. You can view and download it from your online banking account...",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    isRead: true,
    isStarred: false,
    hasAttachment: true,
    isImportant: false,
  },
  {
    id: "9",
    sender: {
      name: "Spotify",
      email: "no-reply@spotify.com",
    },
    subject: "Your Wrapped 2024 is ready!",
    preview:
      "Discover your most played songs, artists, and genres from this year. Your personalized Wrapped experience is waiting for you...",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    isRead: false,
    isStarred: true,
    hasAttachment: false,
    isImportant: false,
  },
  {
    id: "10",
    sender: {
      name: "Google Drive",
      email: "drive-shares-dm-noreply@google.com",
    },
    subject: "Document shared with you",
    preview:
      "Alice Smith has shared a document with you: 'Project Proposal Draft'. You can view and edit this document using the link below...",
    timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    isImportant: true,
  },
  {
    id: "11",
    sender: {
      name: "Slack",
      email: "feedback@slack.com",
    },
    subject: "New features in Slack",
    preview:
      "We've added some exciting new features to help you stay productive. Check out the latest updates including improved search and new emoji reactions...",
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    isImportant: false,
  },
  {
    id: "12",
    sender: {
      name: "Adobe Creative Cloud",
      email: "noreply@adobe.com",
    },
    subject: "Subscription renewal reminder",
    preview:
      "Your Adobe Creative Cloud subscription will renew in 7 days. Make sure your payment information is up to date to avoid any interruption...",
    timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    isRead: false,
    isStarred: false,
    hasAttachment: false,
    isImportant: true,
  },
  {
    id: "13",
    sender: {
      name: "Zoom",
      email: "no-reply@zoom.us",
    },
    subject: "Meeting recording available",
    preview:
      "The recording for your meeting 'Q3 Review Meeting' is now available. You can access it from your Zoom account or use the direct link...",
    timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
    isRead: true,
    isStarred: false,
    hasAttachment: true,
    isImportant: false,
  },
  {
    id: "14",
    sender: {
      name: "Dropbox",
      email: "no-reply@dropbox.com",
    },
    subject: "Storage space running low",
    preview:
      "You're using 95% of your Dropbox storage space. Consider upgrading your plan or cleaning up old files to free up space...",
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
    isRead: false,
    isStarred: true,
    hasAttachment: false,
    isImportant: true,
  },
  {
    id: "15",
    sender: {
      name: "PayPal",
      email: "service@paypal.com",
    },
    subject: "Payment confirmation",
    preview:
      "You've successfully sent $150.00 to John Doe. Your transaction ID is 1234567890. Keep this email for your records...",
    timestamp: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    isImportant: false,
  },
]

export function DashboardLayout() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("inbox")
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [selectedEmail, setSelectedEmail] = useState<any>(null)
  const [emails, setEmails] = useState<GmailEmail[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showCompose, setShowCompose] = useState(false)
  const [composeMode, setComposeMode] = useState<"compose" | "reply" | "forward">("compose")
  const [composeEmail, setComposeEmail] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gmailService, setGmailService] = useState<GmailService | null>(null)

  const sidebarItems = [
    { id: "inbox", label: "Inbox", icon: Mail, count: emails.filter(e => !e.isRead).length },
    { id: "sent", label: "Sent", icon: Send, count: 0 },
    { id: "drafts", label: "Drafts", icon: FileText, count: 0 },
    { id: "trash", label: "Trash", icon: Trash2, count: 0 },
  ]

  // Initialize Gmail service and fetch emails
  useEffect(() => {
    const initializeGmail = async () => {
      if (status === "loading") return
      
      if (!session?.accessToken) {
        router.push("/login")
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const service = new GmailService(session.accessToken)
        setGmailService(service)
        
        const fetchedEmails = await service.getEmails()
        setEmails(fetchedEmails)
      } catch (err) {
        console.error("Failed to initialize Gmail:", err)
        setError("Failed to load emails. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    initializeGmail()
  }, [session, status, router])

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmails((prev) => (prev.includes(emailId) ? prev.filter((id) => id !== emailId) : [...prev, emailId]))
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedEmails(checked ? emails.map((email) => email.id) : [])
  }

  const handleEmailClick = (email: any) => {
    setSelectedEmail(email)
    // Mark email as read if it's not already read
    if (!email.isRead && gmailService) {
      gmailService.markAsRead(email.id).catch(console.error)
      setEmails(prev => prev.map(e => e.id === email.id ? { ...e, isRead: true } : e))
    }
  }

  const handleCompose = () => {
    setComposeMode("compose")
    setComposeEmail(null)
    setShowCompose(true)
  }

  const handleReply = () => {
    setComposeMode("reply")
    setComposeEmail(selectedEmail)
    setShowCompose(true)
  }

  const handleForward = () => {
    setComposeMode("forward")
    setComposeEmail(selectedEmail)
    setShowCompose(true)
  }

  const handleDeleteEmail = async () => {
    if (selectedEmail && gmailService) {
      try {
        await gmailService.deleteEmail(selectedEmail.id)
        setEmails((prev) => prev.filter((email) => email.id !== selectedEmail.id))
        setSelectedEmail(null)
      } catch (error) {
        console.error("Failed to delete email:", error)
        setError("Failed to delete email. Please try again.")
      }
    }
  }

  const handleBulkDelete = async () => {
    if (gmailService && selectedEmails.length > 0) {
      try {
        await Promise.all(selectedEmails.map(id => gmailService.deleteEmail(id)))
        setEmails((prev) => prev.filter((email) => !selectedEmails.includes(email.id)))
        setSelectedEmails([])
      } catch (error) {
        console.error("Failed to delete emails:", error)
        setError("Failed to delete emails. Please try again.")
      }
    }
  }

  const handleBulkArchive = async () => {
    if (gmailService && selectedEmails.length > 0) {
      try {
        await Promise.all(selectedEmails.map(id => gmailService.archiveEmail(id)))
        setEmails((prev) => prev.filter((email) => !selectedEmails.includes(email.id)))
        setSelectedEmails([])
      } catch (error) {
        console.error("Failed to archive emails:", error)
        setError("Failed to archive emails. Please try again.")
      }
    }
  }

  const handleBulkStar = async () => {
    if (gmailService && selectedEmails.length > 0) {
      try {
        await Promise.all(selectedEmails.map(id => gmailService.starEmail(id)))
        setEmails((prev) =>
          prev.map((email) => (selectedEmails.includes(email.id) ? { ...email, isStarred: true } : email)),
        )
        setSelectedEmails([])
      } catch (error) {
        console.error("Failed to star emails:", error)
        setError("Failed to star emails. Please try again.")
      }
    }
  }

  const handleApplyFilters = (filters: any) => {
    // In a real app, this would filter emails based on the criteria
    console.log("Applying filters:", filters)
    // For demo, we'll just show a subset based on sender filter
    if (filters.sender) {
      const filtered = emails.filter(
        (email) =>
          email.sender.name.toLowerCase().includes(filters.sender.toLowerCase()) ||
          email.sender.email.toLowerCase().includes(filters.sender.toLowerCase()),
      )
      setEmails(filtered)
    } else {
      // Refresh emails from Gmail
      if (gmailService) {
        gmailService.getEmails().then(setEmails).catch(console.error)
      }
    }
  }

  const handleDeleteAll = () => {
    setEmails([])
    setSelectedEmails([])
    setSelectedEmail(null)
  }

  const handleDeleteRead = () => {
    setEmails((prev) => prev.filter((email) => !email.isRead))
    setSelectedEmails([])
    setSelectedEmail(null)
  }

  const handleDeleteUnread = () => {
    setEmails((prev) => prev.filter((email) => email.isRead))
    setSelectedEmails([])
    setSelectedEmail(null)
  }

  const handleDeleteSelected = (emailIds: string[]) => {
    setEmails((prev) => prev.filter((email) => !emailIds.includes(email.id)))
    setSelectedEmails([])
    setSelectedEmail(null)
  }

  const handleDeleteByDateRange = (emailIds: string[]) => {
    setEmails((prev) => prev.filter((email) => !emailIds.includes(email.id)))
    setSelectedEmails([])
    setSelectedEmail(null)
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="font-semibold text-sidebar-foreground">Clean Webmail</h1>
          </div>
        </div>

        {/* Compose Button */}
        <div className="p-4">
          <Button className="w-full justify-start gap-2" size="lg" onClick={handleCompose}>
            <Plus className="w-4 h-4" />
            Compose
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {item.count}
                    </Badge>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Settings */}
        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={() => setActiveSection("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeSection === "settings"
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/10"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search emails..." className="pl-10 bg-muted/50 border-0 focus-visible:ring-1" />
            </div>


          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{session?.user?.email || "Loading..."}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">Connected via Gmail</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="h-full bg-card rounded-lg border border-border overflow-hidden flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading your emails...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium text-destructive">Error loading emails</p>
                    <p className="text-sm text-muted-foreground mt-1">{error}</p>
                  </div>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : selectedEmail ? (
              <EmailView
                email={selectedEmail}
                onBack={() => setSelectedEmail(null)}
                onReply={handleReply}
                onForward={handleForward}
                onDelete={handleDeleteEmail}
              />
            ) : (
              <>
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="text-2xl font-semibold capitalize text-card-foreground">{activeSection}</h2>
                  {activeSection === "inbox" && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2"
                      >
                        <Filter className="w-4 h-4" />
                        Filters
                      </Button>
                      {emails.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeleteModal(true)}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Bulk Delete
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Bulk Actions Toolbar and Filters */}
                {activeSection === "inbox" && (
                  <>
                    <BulkActionsToolbar
                      selectedCount={selectedEmails.length}
                      onBulkDelete={handleBulkDelete}
                      onBulkArchive={handleBulkArchive}
                      onBulkStar={handleBulkStar}
                      onClearSelection={() => setSelectedEmails([])}
                    />
                    {showFilters && <BulkDeleteFilters onApplyFilters={handleApplyFilters} />}
                  </>
                )}

                {/* Email List */}
                <div className="flex-1 overflow-auto">
                  {activeSection === "inbox" ? (
                    <EmailList
                      emails={emails}
                      selectedEmails={selectedEmails}
                      onEmailSelect={handleEmailSelect}
                      onEmailClick={handleEmailClick}
                      onSelectAll={handleSelectAll}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      <div className="text-center space-y-2">
                        <Mail className="w-12 h-12 mx-auto opacity-50" />
                        <p>Email content will appear here</p>
                        <p className="text-sm">Select {activeSection} to view emails</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Compose Modal */}
      <ComposeModal
        isOpen={showCompose}
        onClose={() => setShowCompose(false)}
        replyTo={composeMode === "reply" ? composeEmail : undefined}
        forwardEmail={composeMode === "forward" ? composeEmail : undefined}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        emails={emails}
        selectedEmails={selectedEmails}
        onDeleteAll={handleDeleteAll}
        onDeleteRead={handleDeleteRead}
        onDeleteUnread={handleDeleteUnread}
        onDeleteSelected={handleDeleteSelected}
        onDeleteByDateRange={handleDeleteByDateRange}
      />
    </div>
  )
}
