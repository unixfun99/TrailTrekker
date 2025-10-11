import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HikeCard from "@/components/HikeCard";
import HikeFilters from "@/components/HikeFilters";
import StatsCard from "@/components/StatsCard";
import HikeDetailSheet from "@/components/HikeDetailSheet";
import ShareDialog from "@/components/ShareDialog";
import { TrendingUp, MapPin } from "lucide-react";
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

export default function Home() {
  const [selectedHikeId, setSelectedHikeId] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: hikes = [], isLoading, error } = useQuery<HikeData[]>({
    queryKey: ["/api/hikes"],
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
      description: "Please log in to view your hikes",
      variant: "destructive",
    });
    window.location.href = "/api/login";
    return null;
  }

  const selectedHike = hikes.find((h) => h.id === selectedHikeId);

  const totalDistance = hikes.reduce((sum, hike) => {
    const distance = parseFloat(hike.distance);
    return sum + (isNaN(distance) ? 0 : distance);
  }, 0);

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-outfit font-bold mb-1" data-testid="text-page-title">My Hikes</h1>
          <p className="text-muted-foreground">Track and share your hiking adventures</p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <StatsCard icon={TrendingUp} label="Total Hikes" value={hikes.length.toString()} />
          <StatsCard icon={MapPin} label="Miles Hiked" value={totalDistance.toFixed(1)} />
        </div>

        <HikeFilters onFilterChange={(filters) => console.log('Filters:', filters)} />

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : hikes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hikes yet. Start logging your adventures!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hikes.map((hike) => (
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
                isShared={hike.collaborators.length > 0}
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
        onShare={() => {
          setShareDialogOpen(true);
          setSelectedHikeId(null);
        }}
        onEdit={() => console.log('Edit hike')}
      />

      {selectedHike && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          hikeId={selectedHike.id}
          hikeName={selectedHike.title}
          existingCollaborators={selectedHike.collaborators?.map((c) => ({
            id: c.id,
            name: c.name,
            email: `${c.name.toLowerCase().replace(/\s/g, '')}@example.com`,
            avatar: c.avatar
          })) || []}
        />
      )}
    </div>
  );
}
