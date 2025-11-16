import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import HikeForm from "@/components/HikeForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AddHike() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const createHikeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/hikes", data);
      return response.json();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Authentication required",
          description: "Please log in to add hikes",
          variant: "destructive",
        });
        window.location.href = "/api/login";
      } else {
        toast({
          title: "Error",
          description: "Failed to save hike. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleFormSubmit = async (data: any) => {
    try {
      const hike = await createHikeMutation.mutateAsync(data);
      
      // Invalidate queries after hike is created (and photos uploaded in HikeForm)
      // Delay slightly to ensure photo uploads complete
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/hikes"] });
      }, 500);
      
      // Navigate back to home
      setLocation("/");
      
      return hike;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation("/")}
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
        <HikeForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}