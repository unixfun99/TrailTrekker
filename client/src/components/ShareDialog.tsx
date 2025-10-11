import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, X, Mail } from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hikeName?: string;
  existingCollaborators?: Collaborator[];
  onShare?: (email: string) => void;
  onRemove?: (id: string) => void;
}

export default function ShareDialog({ 
  open, 
  onOpenChange, 
  hikeName = "this hike",
  existingCollaborators = [],
  onShare,
  onRemove
}: ShareDialogProps) {
  const [email, setEmail] = useState("");

  const handleShare = () => {
    if (email) {
      console.log('Sharing with:', email);
      onShare?.(email);
      setEmail("");
    }
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
              />
              <Button onClick={handleShare} data-testid="button-send-invite">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
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
                      onClick={() => {
                        console.log('Removing collaborator:', collab.id);
                        onRemove?.(collab.id);
                      }}
                      data-testid={`button-remove-${collab.id}`}
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