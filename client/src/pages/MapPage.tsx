import { useState } from "react";
import MapView from "@/components/MapView";
import HikeDetailSheet from "@/components/HikeDetailSheet";

export default function MapPage() {
  const [selectedHikeId, setSelectedHikeId] = useState<string | null>(null);

  // todo: remove mock functionality
  const mockHikes = [
    {
      id: "1",
      title: "Eagle Peak Trail",
      location: "Yosemite National Park, CA",
      lat: 37.7,
      lng: -119.5,
      difficulty: "moderate" as const,
      date: new Date('2024-10-05'),
      duration: "3h 45m",
      distance: "8.2 mi",
      notes: "Stunning views at the summit!",
      photos: [
        { id: "1", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" }
      ],
      collaborators: []
    },
    {
      id: "2",
      title: "Misty Falls Loop",
      location: "Olympic National Park, WA",
      lat: 37.8,
      lng: -119.6,
      difficulty: "easy" as const,
      date: new Date('2024-09-28'),
      duration: "2h 15m",
      distance: "5.3 mi",
      photos: [
        { id: "2", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" }
      ],
      collaborators: []
    },
    {
      id: "3",
      title: "Summit Ridge",
      location: "Rocky Mountain National Park, CO",
      lat: 37.9,
      lng: -119.7,
      difficulty: "expert" as const,
      date: new Date('2024-09-15'),
      duration: "6h 30m",
      distance: "12.8 mi",
      photos: [
        { id: "3", url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&q=80" }
      ],
      collaborators: []
    }
  ];

  const selectedHike = mockHikes.find(h => h.id === selectedHikeId);

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-outfit font-bold mb-1" data-testid="text-page-title">Trail Map</h1>
          <p className="text-muted-foreground">Explore your hiking locations</p>
        </div>
      </div>

      <div className="h-[calc(100vh-180px)] p-4">
        <MapView
          hikes={mockHikes.map(h => ({ id: h.id, title: h.title, lat: h.lat, lng: h.lng, difficulty: h.difficulty }))}
          onHikeClick={setSelectedHikeId}
        />
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