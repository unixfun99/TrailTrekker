import HikeCard from '../HikeCard';

export default function HikeCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <HikeCard
        id="1"
        title="Eagle Peak Trail"
        location="Yosemite National Park, CA"
        date={new Date('2024-10-05')}
        duration="3h 45m"
        distance="8.2 mi"
        difficulty="moderate"
        imageUrl="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
        isShared={true}
        collaborators={[
          { name: "Sarah K", avatar: "https://i.pravatar.cc/150?img=1" },
          { name: "Mike R", avatar: "https://i.pravatar.cc/150?img=2" },
          { name: "Lisa P" }
        ]}
        onClick={() => console.log('Hike card clicked')}
      />
    </div>
  );
}