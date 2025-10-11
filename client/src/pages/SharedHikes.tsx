import { useState } from "react";
import HikeCard from "@/components/HikeCard";
import HikeDetailSheet from "@/components/HikeDetailSheet";
import { Users } from "lucide-react";

export default function SharedHikes() {
  const [selectedHikeId, setSelectedHikeId] = useState<string | null>(null);

  // todo: remove mock functionality
  const mockSharedHikes = [
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
      notes: "Stunning views at the summit!",
      photos: [
        { id: "1", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" }
      ],
      collaborators: [
        { name: "Sarah K", avatar: "https://i.pravatar.cc/150?img=1" },
        { name: "Mike R", avatar: "https://i.pravatar.cc/150?img=2" }
      ]
    }
  ];

  const selectedHike = mockSharedHikes.find(h => h.id === selectedHikeId);

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-outfit font-bold mb-1" data-testid="text-page-title">Shared Hikes</h1>
          <p className="text-muted-foreground">Trails shared with you</p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-6">
        {mockSharedHikes.length === 0 ? (
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
            {mockSharedHikes.map((hike) => (
              <HikeCard
                key={hike.id}
                {...hike}
                onClick={() => setSelectedHikeId(hike.id)}
              />
            ))}
          </div>
        )}
      </div>

      <HikeDetailSheet
        open={!!selectedHikeId}
        onOpenChange={(open) => !open && setSelectedHikeId(null)}
        hike={selectedHike}
        onShare={() => console.log('Share clicked')}
        onEdit={() => console.log('Edit clicked')}
      />
    </div>
  );
}