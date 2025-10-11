import MapView from '../MapView';

export default function MapViewExample() {
  const mockHikes = [
    { id: "1", title: "Eagle Peak Trail", lat: 37.7, lng: -119.5, difficulty: "moderate" as const },
    { id: "2", title: "Misty Falls Loop", lat: 37.8, lng: -119.6, difficulty: "easy" as const },
    { id: "3", title: "Summit Ridge", lat: 37.9, lng: -119.7, difficulty: "hard" as const }
  ];

  return (
    <div className="h-[500px] p-4">
      <MapView 
        hikes={mockHikes}
        onHikeClick={(id) => console.log('Hike clicked:', id)}
      />
    </div>
  );
}