"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2, Archive, Star, MoreHorizontal, Calendar, User, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BulkActionsToolbarProps {
  selectedCount: number
  onBulkDelete: () => void
  onBulkArchive: () => void
  onBulkStar: () => void
  onClearSelection: () => void
}

export function BulkActionsToolbar({
  selectedCount,
  onBulkDelete,
  onBulkArchive,
  onBulkStar,
  onClearSelection,
}: BulkActionsToolbarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  const handleBulkDelete = () => {
    onBulkDelete()
    setShowDeleteDialog(false)
    toast({
      title: "Emails deleted",
      description: `${selectedCount} email${selectedCount > 1 ? "s" : ""} moved to trash`,
    })
  }

  const handleBulkArchive = () => {
    onBulkArchive()
    toast({
      title: "Emails archived",
      description: `${selectedCount} email${selectedCount > 1 ? "s" : ""} archived successfully`,
    })
  }

  const handleBulkStar = () => {
    onBulkStar()
    toast({
      title: "Emails starred",
      description: `${selectedCount} email${selectedCount > 1 ? "s" : ""} marked as starred`,
    })
  }

  if (selectedCount === 0) return null

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-primary/5 border-b border-primary/20 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {selectedCount} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear selection
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Primary Actions */}
          <Button variant="outline" size="sm" onClick={handleBulkArchive} className="gap-2 bg-transparent">
            <Archive className="w-4 h-4" />
            Archive
          </Button>

          <Button variant="outline" size="sm" onClick={handleBulkStar} className="gap-2 bg-transparent">
            <Star className="w-4 h-4" />
            Star
          </Button>

          <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)} className="gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Mark as read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Mark as unread
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Filter className="mr-2 h-4 w-4" />
                Add label
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete permanently
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedCount} email{selectedCount > 1 ? "s" : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will move the selected email{selectedCount > 1 ? "s" : ""} to trash. You can restore them from
              the trash folder within 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
