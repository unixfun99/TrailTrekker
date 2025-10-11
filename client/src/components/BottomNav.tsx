import { Home, PlusCircle, Map, Users, User } from "lucide-react";
import { useLocation } from "wouter";

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Map, label: "Map", path: "/map" },
  { icon: PlusCircle, label: "Add", path: "/add" },
  { icon: Users, label: "Shared", path: "/shared" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-inset-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      data-testid="nav-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => {
                console.log(`Navigate to ${item.path}`);
                window.location.hash = item.path;
              }}
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] h-12 rounded-lg hover-elevate active-elevate-2 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              data-testid={`button-nav-${item.label.toLowerCase()}`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}