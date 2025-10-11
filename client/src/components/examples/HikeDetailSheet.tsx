import { useState } from 'react';
import HikeDetailSheet from '../HikeDetailSheet';
import { Button } from '@/components/ui/button';

export default function HikeDetailSheetExample() {
  const [open, setOpen] = useState(false);
  
  const mockHike = {
    id: "1",
    title: "Eagle Peak Trail",
    location: "Yosemite National Park, CA",
    date: new Date('2024-10-05'),
    duration: "3h 45m",
    distance: "8.2 mi",
    difficulty: "moderate" as const,
    notes: "Stunning views at the summit! Trail was well-maintained. Recommend bringing plenty of water and starting early to avoid afternoon heat.",
    photos: [
      { id: "1", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
      { id: "2", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
    ],
    collaborators: [
      { name: "Sarah K", avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Mike R", avatar: "https://i.pravatar.cc/150?img=2" }
    ]
  };

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Hike Details</Button>
      <HikeDetailSheet
        open={open}
        onOpenChange={setOpen}
        hike={mockHike}
        onShare={() => console.log('Share clicked')}
        onEdit={() => console.log('Edit clicked')}
      />
    </div>
  );
}