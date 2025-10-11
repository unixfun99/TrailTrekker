import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Clock, TrendingUp, Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface HikeFormProps {
  onSubmit?: (data: any) => Promise<{ id: string } | void> | void;
  initialData?: any;
}

export default function HikeForm({ onSubmit, initialData }: HikeFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    location: initialData?.location || "",
    date: initialData?.date || "",
    duration: initialData?.duration || "",
    distance: initialData?.distance || "",
    difficulty: initialData?.difficulty || "moderate",
    notes: initialData?.notes || "",
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadPhotos = async (hikeId: string) => {
    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('photo', file);
      
      try {
        const response = await fetch(`/api/hikes/${hikeId}/photos`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
        
        return response.json();
      } catch (error) {
        throw error;
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await onSubmit?.(formData);
      
      if (selectedFiles.length > 0 && result && 'id' in result) {
        try {
          await uploadPhotos(result.id);
          toast({
            title: "Success",
            description: `Hike saved with ${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''}!`,
          });
        } catch (photoError) {
          toast({
            title: "Warning",
            description: "Hike saved but some photos failed to upload.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-hike">
      <div className="space-y-2">
        <Label htmlFor="title">Trail Name</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g., Eagle Peak Trail"
          disabled={isSubmitting}
          data-testid="input-title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="e.g., Yosemite National Park, CA"
          disabled={isSubmitting}
          data-testid="input-location"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => updateField('date', e.target.value)}
            disabled={isSubmitting}
            data-testid="input-date"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Duration
          </Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => updateField('duration', e.target.value)}
            placeholder="e.g., 3h 45m"
            disabled={isSubmitting}
            data-testid="input-duration"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="distance">Distance</Label>
          <Input
            id="distance"
            value={formData.distance}
            onChange={(e) => updateField('distance', e.target.value)}
            placeholder="e.g., 8.2 mi"
            disabled={isSubmitting}
            data-testid="input-distance"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Difficulty
          </Label>
          <Select 
            value={formData.difficulty} 
            onValueChange={(value) => updateField('difficulty', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="difficulty" data-testid="select-difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes & Feedback</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Share your thoughts about the trail, conditions, highlights..."
          rows={4}
          disabled={isSubmitting}
          data-testid="input-notes"
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Photos
        </Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          data-testid="input-file"
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleUploadClick}
          disabled={isSubmitting}
          data-testid="button-upload-photos"
        >
          <Camera className="w-4 h-4 mr-2" />
          Upload Photos
        </Button>
        
        {selectedFiles.length > 0 && (
          <div className="space-y-2 mt-3">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
                data-testid={`file-item-${index}`}
              >
                <span className="text-sm truncate flex-1" data-testid={`text-filename-${index}`}>
                  {file.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  disabled={isSubmitting}
                  className="h-6 w-6 ml-2"
                  data-testid={`button-remove-file-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
        data-testid="button-submit"
      >
        {isSubmitting ? "Saving..." : "Save Hike"}
      </Button>
    </form>
  );
}
