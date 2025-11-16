import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

// Fix Leaflet default marker icon issue with bundlers (only once)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Only fix icons if not already done
if (L.Icon.Default.prototype._getIconUrl) {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
}

interface HikeLocation {
  id: string;
  title: string;
  lat: number;
  lng: number;
  difficulty: "easy" | "moderate" | "hard" | "expert";
  location?: string;
}

interface MapViewProps {
  hikes: HikeLocation[];
  onHikeClick?: (hikeId: string) => void;
}

const difficultyColors = {
  easy: "#22c55e",
  moderate: "#f59e0b",
  hard: "#f97316",
  expert: "#ef4444"
};

export default function MapView({ hikes, onHikeClick }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Filter hikes with valid coordinates
    const validHikes = hikes.filter(h => h.lat && h.lng && !isNaN(h.lat) && !isNaN(h.lng));

    if (validHikes.length === 0) {
      // Clear any existing markers and map
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      return;
    }

    // Initialize map if not already created
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [validHikes[0].lat, validHikes[0].lng],
        10
      );

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each hike
    validHikes.forEach((hike) => {
      const marker = L.marker([hike.lat, hike.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${difficultyColors[hike.difficulty]}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                     <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                     <circle cx="12" cy="10" r="3"></circle>
                   </svg>
                 </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        })
      });

      marker.bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif;">
          <strong style="font-size: 14px; display: block; margin-bottom: 4px;">${hike.title}</strong>
          ${hike.location ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">${hike.location}</div>` : ''}
          <div style="font-size: 11px; padding: 2px 8px; background: ${difficultyColors[hike.difficulty]}; color: white; border-radius: 12px; display: inline-block; text-transform: capitalize;">${hike.difficulty}</div>
        </div>
      `);

      marker.on('click', () => {
        onHikeClick?.(hike.id);
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    // Fit map bounds to show all markers
    if (markersRef.current.length > 1) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current!.fitBounds(group.getBounds().pad(0.1));
    } else if (markersRef.current.length === 1) {
      mapRef.current!.setView([validHikes[0].lat, validHikes[0].lng], 13);
    }

    return () => {
      // Only clean up markers, keep map instance
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [hikes, onHikeClick]);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const validHikes = hikes.filter(h => h.lat && h.lng && !isNaN(h.lat) && !isNaN(h.lng));

  if (validHikes.length === 0) {
    return (
      <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden" data-testid="map-view">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              No hike locations available. Add coordinates to your hikes to see them on the map.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden" data-testid="map-view">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Hike count overlay */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Card className="px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{validHikes.length} {validHikes.length === 1 ? 'hike' : 'hikes'} on map</span>
          </div>
        </Card>
      </div>
    </div>
  );
}