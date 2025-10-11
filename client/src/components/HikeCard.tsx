import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export type DifficultyLevel = "easy" | "moderate" | "hard" | "expert";

interface HikeCardProps {
  id: string;
  title: string;
  location: string;
  date: Date;
  duration: string;
  distance: string;
  difficulty: DifficultyLevel;
  imageUrl?: string;
  isShared?: boolean;
  collaborators?: Array<{ name: string; avatar?: string }>;
  onClick?: () => void;
}

const difficultyConfig: Record<DifficultyLevel, { bg: string; text: string; label: string }> = {
  easy: { bg: "bg-green-500/20 dark:bg-green-500/20", text: "text-green-700 dark:text-green-400", label: "Easy" },
  moderate: { bg: "bg-amber-500/20 dark:bg-amber-500/20", text: "text-amber-700 dark:text-amber-400", label: "Moderate" },
  hard: { bg: "bg-orange-500/20 dark:bg-orange-500/20", text: "text-orange-700 dark:text-orange-400", label: "Hard" },
  expert: { bg: "bg-red-500/20 dark:bg-red-500/20", text: "text-red-700 dark:text-red-400", label: "Expert" }
};

export default function HikeCard({
  title,
  location,
  date,
  duration,
  distance,
  difficulty,
  imageUrl,
  isShared,
  collaborators,
  onClick
}: HikeCardProps) {
  const diffStyle = difficultyConfig[difficulty];

  return (
    <Card 
      className={`overflow-hidden hover-elevate active-elevate-2 cursor-pointer ${isShared ? 'ring-2 ring-primary/20' : ''}`}
      onClick={onClick}
      data-testid={`card-hike-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {imageUrl && (
        <div className="relative w-full aspect-video">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-outfit font-semibold text-lg leading-tight" data-testid="text-hike-title">
              {title}
            </h3>
          </div>
        </div>
      )}
      
      <div className="p-4 space-y-3">
        {!imageUrl && (
          <h3 className="font-outfit font-semibold text-lg" data-testid="text-hike-title">{title}</h3>
        )}
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span data-testid="text-location">{location}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span data-testid="text-date">{format(date, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span data-testid="text-duration">{duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Badge className={`${diffStyle.bg} ${diffStyle.text} rounded-full`} data-testid="badge-difficulty">
            <TrendingUp className="w-3 h-3 mr-1" />
            {diffStyle.label}
          </Badge>
          
          <span className="text-sm font-medium" data-testid="text-distance">{distance}</span>
        </div>

        {collaborators && collaborators.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <div className="flex -space-x-2">
              {collaborators.slice(0, 3).map((collab, idx) => (
                <Avatar key={idx} className="w-6 h-6 border-2 border-card" data-testid={`avatar-collaborator-${idx}`}>
                  <AvatarImage src={collab.avatar} />
                  <AvatarFallback className="text-xs">{collab.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {collaborators.length > 3 ? `+${collaborators.length - 3} others` : 'Shared'}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}