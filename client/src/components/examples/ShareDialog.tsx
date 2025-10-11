import { useState } from 'react';
import ShareDialog from '../ShareDialog';
import { Button } from '@/components/ui/button';

export default function ShareDialogExample() {
  const [open, setOpen] = useState(false);
  
  const mockCollaborators = [
    { id: "1", name: "Sarah Kim", email: "sarah@example.com", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "2", name: "Mike Rodriguez", email: "mike@example.com", avatar: "https://i.pravatar.cc/150?img=2" }
  ];

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Share Dialog</Button>
      <ShareDialog
        open={open}
        onOpenChange={setOpen}
        hikeName="Eagle Peak Trail"
        existingCollaborators={mockCollaborators}
        onShare={(email) => console.log('Share with:', email)}
        onRemove={(id) => console.log('Remove:', id)}
      />
    </div>
  );
}