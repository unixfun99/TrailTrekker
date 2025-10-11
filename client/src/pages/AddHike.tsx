import HikeForm from "@/components/HikeForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddHike() {
  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                console.log('Navigate back');
                window.location.hash = '/';
              }}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-outfit font-bold" data-testid="text-page-title">Log New Hike</h1>
          </div>
          <p className="text-muted-foreground pl-12">Record your hiking adventure</p>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-6">
        <HikeForm onSubmit={(data) => {
          console.log('Hike saved:', data);
          window.location.hash = '/';
        }} />
      </div>
    </div>
  );
}