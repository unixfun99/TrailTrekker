import BottomNav from '../BottomNav';

export default function BottomNavExample() {
  return (
    <div className="relative h-screen">
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Content area</p>
      </div>
      <BottomNav />
    </div>
  );
}