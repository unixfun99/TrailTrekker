import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/StatsCard";
import ThemeToggle from "@/components/ThemeToggle";
import { TrendingUp, MapPin, Clock, Users, Settings, LogOut } from "lucide-react";

export default function Profile() {
  // todo: remove mock functionality
  const mockUser = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    memberSince: "January 2024"
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-outfit font-bold" data-testid="text-page-title">Profile</h1>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20" data-testid="avatar-user">
              <AvatarImage src={mockUser.avatar} />
              <AvatarFallback className="text-2xl">{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-outfit font-semibold" data-testid="text-user-name">{mockUser.name}</h2>
              <p className="text-muted-foreground" data-testid="text-user-email">{mockUser.email}</p>
              <p className="text-sm text-muted-foreground mt-1">Member since {mockUser.memberSince}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Your Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatsCard icon={TrendingUp} label="Total Hikes" value="24" />
            <StatsCard icon={MapPin} label="Miles Hiked" value="186.5" />
            <StatsCard icon={Clock} label="Hours Spent" value="82" />
            <StatsCard icon={Users} label="Shared Trails" value="12" />
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3"
            onClick={() => console.log('Settings clicked')}
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
            onClick={() => console.log('Logout clicked')}
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}