import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, TrendingUp, Share2, Edit } from "lucide-react";
import { format } from "date-fns";
import PhotoGallery from "./PhotoGallery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
}

const difficultyConfig = {
  easy: { bg: "bg-green-500/20 dark:bg-green-500/20", text: "text-green-700 dark:text-green-400", label: "Easy" },
  moderate: { bg: "bg-amber-500/20 dark:bg-amber-500/20", text: "text-amber-700 dark:text-amber-400", label: "Moderate" },
  hard: { bg: "bg-orange-500/20 dark:bg-orange-500/20", text: "text-orange-700 dark:text-orange-400", label: "Hard" },
  expert: { bg: "bg-red-500/20 dark:bg-red-500/20", text: "text-red-700 dark:text-red-400", label: "Expert" }
};

export default function HikeDetailSheet({ open, onOpenChange, hike, onShare, onEdit }: HikeDetailSheetProps) {
  if (!hike) return null;

  const diffStyle = difficultyConfig[hike.difficulty];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto" data-testid="sheet-hike-detail">
        <SheetHeader>
          <SheetTitle className="font-outfit text-2xl">{hike.title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="flex gap-2">
            <Button onClick={onEdit} variant="outline" className="flex-1" data-testid="button-edit-hike">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={onShare} className="flex-1" data-testid="button-share-hike">
              <Share2 className="w-4 h-4 mr-2" />
              Share
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
    </Sheet>
  );
}