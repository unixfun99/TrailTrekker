import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, TrendingUp, Share2, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import PhotoGallery from "./PhotoGallery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface HikeDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hike?: {
    id: string;
    title: string;
    location: string;
    date: Date;
    duration: string;
    distance: string;
    difficulty: "easy" | "moderate" | "hard" | "expert";
    notes?: string;
    photos: Array<{ id: string; url: string }>;
    collaborators?: Array<{ name: string; avatar?: string }>;
  };
  onShare?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const difficultyConfig = {
  easy: { bg: "bg-green-500/20 dark:bg-green-500/20", text: "text-green-700 dark:text-green-400", label: "Easy" },
  moderate: { bg: "bg-amber-500/20 dark:bg-amber-500/20", text: "text-amber-700 dark:text-amber-400", label: "Moderate" },
  hard: { bg: "bg-orange-500/20 dark:bg-orange-500/20", text: "text-orange-700 dark:text-orange-400", label: "Hard" },
  expert: { bg: "bg-red-500/20 dark:bg-red-500/20", text: "text-red-700 dark:text-red-400", label: "Expert" }
};

export default function HikeDetailSheet({ open, onOpenChange, hike, onShare, onEdit, onDelete }: HikeDetailSheetProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!hike) return null;

  const diffStyle = difficultyConfig[hike.difficulty];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.();
      // Only close dialog on success (parent will handle)
    } catch (error) {
      setIsDeleting(false);
      // Keep dialog open on error
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto" data-testid="sheet-hike-detail">
        <SheetHeader>
          <SheetTitle className="font-outfit text-2xl">{hike.title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onEdit} variant="outline" data-testid="button-edit-hike">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={onShare} data-testid="button-share-hike">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              onClick={() => setDeleteDialogOpen(true)} 
              variant="destructive" 
              className="col-span-2"
              data-testid="button-delete-hike"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Hike
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span>{hike.location}</span>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{format(hike.date, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{hike.duration}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge className={`${diffStyle.bg} ${diffStyle.text} rounded-full`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {diffStyle.label}
              </Badge>
              <span className="font-semibold">{hike.distance}</span>
            </div>
          </div>

          {hike.collaborators && hike.collaborators.length > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <div className="flex -space-x-2">
                {hike.collaborators.slice(0, 4).map((collab, idx) => (
                  <Avatar key={idx} className="w-8 h-8 border-2 border-card">
                    <AvatarImage src={collab.avatar} />
                    <AvatarFallback className="text-xs">{collab.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Shared with {hike.collaborators.length} {hike.collaborators.length === 1 ? 'person' : 'people'}
              </span>
            </div>
          )}

          {hike.notes && (
            <div className="space-y-2">
              <h4 className="font-semibold">Notes</h4>
              <p className="text-muted-foreground">{hike.notes}</p>
            </div>
          )}

          {hike.photos.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Photos</h4>
              <PhotoGallery photos={hike.photos} />
            </div>
          )}
        </div>
      </SheetContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="dialog-delete-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this hike?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{hike.title}" and all associated photos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}