import { useState } from "react";
import HikeCard from "@/components/HikeCard";
import HikeFilters from "@/components/HikeFilters";
import StatsCard from "@/components/StatsCard";
import HikeDetailSheet from "@/components/HikeDetailSheet";
import ShareDialog from "@/components/ShareDialog";
import { TrendingUp, MapPin, Clock, Users } from "lucide-react";

export default function Home() {
  const [selectedHikeId, setSelectedHikeId] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // todo: remove mock functionality
  const mockHikes = [
    {
      id: "1",
      title: "Eagle Peak Trail",
      location: "Yosemite National Park, CA",
      date: new Date('2024-10-05'),
      duration: "3h 45m",
      distance: "8.2 mi",
      difficulty: "moderate" as const,
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      isShared: true,
      notes: "Stunning views at the summit! Trail was well-maintained.",
      photos: [
        { id: "1", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
        { id: "2", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
      ],
      collaborators: [
        { name: "Sarah K", avatar: "https://i.pravatar.cc/150?img=1" },
        { name: "Mike R", avatar: "https://i.pravatar.cc/150?img=2" }
      ]
    },
    {
      id: "2",
      title: "Misty Falls Loop",
      location: "Olympic National Park, WA",
      date: new Date('2024-09-28'),
      duration: "2h 15m",
      distance: "5.3 mi",
      difficulty: "easy" as const,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      photos: [
        { id: "3", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80" }
      ],
      collaborators: []
    },
    {
      id: "3",
      title: "Summit Ridge Challenge",
      location: "Rocky Mountain National Park, CO",
      date: new Date('2024-09-15'),
      duration: "6h 30m",
      distance: "12.8 mi",
      difficulty: "expert" as const,
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      photos: [
        { id: "4", url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&q=80" }
      ],
      collaborators: []
    }
  ];

  const selectedHike = mockHikes.find(h => h.id === selectedHikeId);

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
          <StatsCard icon={TrendingUp} label="Total Hikes" value="24" />
          <StatsCard icon={MapPin} label="Miles Hiked" value="186.5" />
        </div>

        <HikeFilters onFilterChange={(filters) => console.log('Filters:', filters)} />

        <div className="space-y-4">
          {mockHikes.map((hike) => (
            <HikeCard
              key={hike.id}
              {...hike}
              onClick={() => setSelectedHikeId(hike.id)}
            />
          ))}
        </div>
      </div>

      <HikeDetailSheet
        open={!!selectedHikeId}
        onOpenChange={(open) => !open && setSelectedHikeId(null)}
        hike={selectedHike}
        onShare={() => {
          setShareDialogOpen(true);
          setSelectedHikeId(null);
        }}
        onEdit={() => console.log('Edit hike')}
      />

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        hikeName={selectedHike?.title}
        existingCollaborators={selectedHike?.collaborators?.map((c, i) => ({
          id: String(i),
          name: c.name,
          email: `${c.name.toLowerCase().replace(/\s/g, '')}@example.com`,
          avatar: c.avatar
        })) || []}
        onShare={(email) => console.log('Share with:', email)}
        onRemove={(id) => console.log('Remove:', id)}
      />
    </div>
  );
}