import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HikeCard from "@/components/HikeCard";
import HikeDetailSheet from "@/components/HikeDetailSheet";
import { Users } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";

interface HikeData {
  id: string;
  title: string;
  location: string;
  date: string;
  duration: string;
  distance: string;
  difficulty: "easy" | "moderate" | "hard" | "expert";
  notes?: string;
  photos: Array<{ id: string; url: string }>;
  collaborators: Array<{ id: string; name: string; avatar?: string }>;
}

export default function SharedHikes() {
  const [selectedHikeId, setSelectedHikeId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: sharedHikes = [], isLoading, error } = useQuery<HikeData[]>({
    queryKey: ["/api/hikes/shared"],
    retry: (failureCount, error) => {
      if (error instanceof Error && isUnauthorizedError(error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  if (error instanceof Error && isUnauthorizedError(error)) {
    toast({
      title: "Authentication required",
      description: "Please log in to view shared hikes",
      variant: "destructive",
    });
    window.location.href = "/api/login";
    return null;
  }

  const selectedHike = sharedHikes.find((h) => h.id === selectedHikeId);

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-outfit font-bold mb-1" data-testid="text-page-title">Shared Hikes</h1>
          <p className="text-muted-foreground">Trails shared with you</p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : sharedHikes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No shared hikes yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              When others share their hikes with you, they'll appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sharedHikes.map((hike) => (
              <HikeCard
                key={hike.id}
                id={hike.id}
                title={hike.title}
                location={hike.location}
                date={new Date(hike.date)}
                duration={hike.duration}
                distance={hike.distance}
                difficulty={hike.difficulty}
                imageUrl={hike.photos[0]?.url}
                isShared={true}
                collaborators={hike.collaborators}
                onClick={() => setSelectedHikeId(hike.id)}
              />
            ))}
          </div>
        )}
      </div>

      <HikeDetailSheet
        open={!!selectedHikeId}
        onOpenChange={(open) => !open && setSelectedHikeId(null)}
        hike={selectedHike ? {
          id: selectedHike.id,
          title: selectedHike.title,
          location: selectedHike.location,
          date: new Date(selectedHike.date),
          duration: selectedHike.duration,
          distance: selectedHike.distance,
          difficulty: selectedHike.difficulty,
          notes: selectedHike.notes,
          photos: selectedHike.photos,
          collaborators: selectedHike.collaborators
        } : undefined}
        onShare={() => console.log('Share clicked')}
        onEdit={() => console.log('Edit clicked')}
      />
    </div>
  );
}