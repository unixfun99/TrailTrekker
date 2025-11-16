import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import HikeForm from "./HikeForm";

interface EditHikeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hike?: {
    id: string;
    title: string;
    location: string;
    date: Date;
    duration: string;
    distance: string;
    difficulty: string;
    notes?: string;
  };
}

export default function EditHikeDialog({ open, onOpenChange, hike }: EditHikeDialogProps) {
  const { toast } = useToast();

  const updateHikeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/hikes/${hike?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hikes"] });
      toast({
        title: "Success",
        description: "Hike updated successfully!",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update hike. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFormSubmit = async (data: any) => {
    await updateHikeMutation.mutateAsync(data);
  };

  if (!hike) return null;

  const initialData = {
    title: hike.title,
    location: hike.location,
    date: hike.date instanceof Date ? hike.date.toISOString().split('T')[0] : hike.date,
    duration: hike.duration,
    distance: hike.distance,
    difficulty: hike.difficulty,
    notes: hike.notes || "",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-edit-hike">
        <DialogHeader>
          <DialogTitle className="font-outfit text-2xl">Edit Hike</DialogTitle>
        </DialogHeader>
        <HikeForm onSubmit={handleFormSubmit} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
}
