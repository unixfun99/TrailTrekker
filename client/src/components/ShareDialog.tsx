import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, X, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hikeId: string;
  hikeName?: string;
  existingCollaborators?: Collaborator[];
}

export default function ShareDialog({ 
  open, 
  onOpenChange, 
  hikeId,
  hikeName = "this hike",
  existingCollaborators = []
}: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const addCollaboratorMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", `/api/hikes/${hikeId}/collaborators`, { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Collaborator added",
        description: "The hike has been shared successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/hikes"] });
      setEmail("");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You must be logged in to share hikes",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to share",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const removeCollaboratorMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("DELETE", `/api/hikes/${hikeId}/collaborators/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Collaborator removed",
        description: "Access has been revoked successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/hikes"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You must be logged in to remove collaborators",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to remove",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleShare = () => {
    if (email) {
      addCollaboratorMutation.mutate(email);
    }
  };

  const handleRemove = (userId: string) => {
    removeCollaboratorMutation.mutate(userId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-share">
        <DialogHeader>
          <DialogTitle>Share Hike</DialogTitle>
          <DialogDescription>
            Invite others to view and edit {hikeName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                data-testid="input-share-email"
                onKeyDown={(e) => e.key === 'Enter' && handleShare()}
                disabled={addCollaboratorMutation.isPending}
              />
              <Button 
                onClick={handleShare} 
                data-testid="button-send-invite"
                disabled={addCollaboratorMutation.isPending}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {addCollaboratorMutation.isPending ? "Inviting..." : "Invite"}
              </Button>
            </div>
          </div>

          {existingCollaborators.length > 0 && (
            <div className="space-y-2">
              <Label>Collaborators</Label>
              <div className="space-y-2">
                {existingCollaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    data-testid={`collaborator-${collab.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={collab.avatar} />
                        <AvatarFallback>{collab.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{collab.name}</p>
                        <p className="text-xs text-muted-foreground">{collab.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(collab.id)}
                      data-testid={`button-remove-${collab.id}`}
                      disabled={removeCollaboratorMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
