import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface HikeLocation {
  id: string;
  title: string;
  lat: number;
  lng: number;
  difficulty: "easy" | "moderate" | "hard" | "expert";
}

interface MapViewProps {
  hikes: HikeLocation[];
  onHikeClick?: (hikeId: string) => void;
}

export default function MapView({ hikes, onHikeClick }: MapViewProps) {
  return (
    <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden" data-testid="map-view">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-3 p-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Interactive map will display hike locations and trails
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 right-4 space-y-2 max-h-48 overflow-y-auto">
        {hikes.slice(0, 3).map((hike) => (
          <Card
            key={hike.id}
            className="p-3 hover-elevate active-elevate-2 cursor-pointer"
            onClick={() => {
              console.log('Map marker clicked:', hike.id);
              onHikeClick?.(hike.id);
            }}
            data-testid={`card-map-hike-${hike.id}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{hike.title}</h4>
                <p className="text-sm text-muted-foreground capitalize">{hike.difficulty}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}