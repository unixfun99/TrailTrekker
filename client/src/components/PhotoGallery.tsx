import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  url: string;
  alt?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  onUpload?: () => void;
  editable?: boolean;
}

export default function PhotoGallery({ photos, onUpload, editable = false }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3" data-testid="gallery-photos">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="relative aspect-square rounded-lg overflow-hidden hover-elevate active-elevate-2"
            data-testid={`button-photo-${photo.id}`}
          >
            <img
              src={photo.url}
              alt={photo.alt || "Hike photo"}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
        
        {editable && (
          <button
            onClick={() => {
              console.log('Upload photo clicked');
              onUpload?.();
            }}
            className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 hover-elevate active-elevate-2 flex flex-col items-center justify-center gap-2 text-muted-foreground"
            data-testid="button-upload-photo"
          >
            <Upload className="w-8 h-8" />
            <span className="text-sm font-medium">Add Photo</span>
          </button>
        )}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl w-full p-0">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            data-testid="button-close-photo"
          >
            <X className="w-6 h-6" />
          </button>
          {selectedPhoto && (
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.alt || "Hike photo"}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}