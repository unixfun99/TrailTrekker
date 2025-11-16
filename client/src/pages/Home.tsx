import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import HikeCard from "@/components/HikeCard";
import HikeFilters from "@/components/HikeFilters";
import StatsCard from "@/components/StatsCard";
import HikeDetailSheet from "@/components/HikeDetailSheet";
import ShareDialog from "@/components/ShareDialog";
import EditHikeDialog from "@/components/EditHikeDialog";
import { TrendingUp, MapPin } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "all",
    sortBy: "date"
  });
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

  // Apply filters to hikes
  const filteredHikes = hikes
    .filter(hike => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = hike.title.toLowerCase().includes(searchLower);
        const matchesLocation = hike.location.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesLocation) return false;
      }

      // Difficulty filter
      if (filters.difficulty !== "all" && hike.difficulty !== filters.difficulty) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort
      if (filters.sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (filters.sortBy === "distance") {
        const distA = parseFloat(a.distance) || 0;
        const distB = parseFloat(b.distance) || 0;
        return distB - distA;
      } else if (filters.sortBy === "difficulty") {
        const difficultyOrder = { easy: 0, moderate: 1, hard: 2, expert: 3 };
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      }
      return 0;
    });

  const selectedHike = hikes.find((h) => h.id === selectedHikeId);

  const deleteHikeMutation = useMutation({
    mutationFn: async (hikeId: string) => {
      const response = await apiRequest("DELETE", `/api/hikes/${hikeId}`);
      if (!response.ok) {
        throw new Error("Failed to delete hike");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hikes"] });
      toast({
        title: "Success",
        description: "Hike deleted successfully",
      });
      setSelectedHikeId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete hike. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteHike = async () => {
    if (selectedHikeId) {
      await deleteHikeMutation.mutateAsync(selectedHikeId);
    }
  };

  const totalDistance = filteredHikes.reduce((sum, hike) => {
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
          <StatsCard icon={TrendingUp} label="Total Hikes" value={filteredHikes.length.toString()} />
          <StatsCard icon={MapPin} label="Miles Hiked" value={totalDistance.toFixed(1)} />
        </div>

        <HikeFilters onFilterChange={setFilters} />

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredHikes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {hikes.length === 0 ? "No hikes yet. Start logging your adventures!" : "No hikes match your filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHikes.map((hike) => (
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
        }}
        onEdit={() => {
          setEditDialogOpen(true);
        }}
        onDelete={handleDeleteHike}
      />

      {selectedHike && (
        <>
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
          
          <EditHikeDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            hike={{
              ...selectedHike,
              date: new Date(selectedHike.date)
            }}
          />
        </>
      )}
    </div>
  );
}
