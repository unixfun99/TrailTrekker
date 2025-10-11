import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MapView from "@/components/MapView";
import HikeDetailSheet from "@/components/HikeDetailSheet";
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

export default function MapPage() {
  const [selectedHikeId, setSelectedHikeId] = useState<string | null>(null);
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
      description: "Please log in to view the map",
      variant: "destructive",
    });
    window.location.href = "/api/login";
    return null;
  }

  const mapHikes = hikes.map((hike, index) => ({
    id: hike.id,
    title: hike.title,
    lat: 37.7 + (index * 0.1),
    lng: -119.5 + (index * 0.1),
    difficulty: hike.difficulty,
  }));

  const selectedHike = hikes.find((h) => h.id === selectedHikeId);

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-outfit font-bold mb-1" data-testid="text-page-title">Trail Map</h1>
          <p className="text-muted-foreground">Explore your hiking locations</p>
        </div>
      </div>

      <div className="h-[calc(100vh-180px)] p-4">
        {isLoading ? (
          <div className="h-full bg-muted animate-pulse rounded-lg" />
        ) : (
          <MapView
            hikes={mapHikes}
            onHikeClick={setSelectedHikeId}
          />
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