import { Button } from "@/components/ui/button";
import { Mountain, TrendingUp, Users, Camera } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <div 
        className="relative flex-1 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        
        <div className="relative z-10 text-center px-4 py-12 max-w-4xl">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
              <Mountain className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-outfit font-bold text-white mb-4" data-testid="text-app-title">
            TrailShare
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Track, Share, Explore Together
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">Track Hikes</h3>
              <p className="text-sm text-white/70">Log location, difficulty, and details</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">Store Photos</h3>
              <p className="text-sm text-white/70">Capture and share your adventures</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">Collaborate</h3>
              <p className="text-sm text-white/70">Share trails with friends</p>
            </div>
          </div>
          
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}