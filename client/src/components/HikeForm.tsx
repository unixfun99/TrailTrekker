import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Clock, TrendingUp, Camera } from "lucide-react";

interface HikeFormProps {
  onSubmit?: (data: any) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onSubmit?.(formData);
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
            data-testid="input-distance"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Difficulty
          </Label>
          <Select value={formData.difficulty} onValueChange={(value) => updateField('difficulty', value)}>
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
          data-testid="input-notes"
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Photos
        </Label>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => console.log('Upload photos clicked')}
          data-testid="button-upload-photos"
        >
          <Camera className="w-4 h-4 mr-2" />
          Upload Photos
        </Button>
      </div>

      <Button type="submit" className="w-full" data-testid="button-submit">
        Save Hike
      </Button>
    </form>
  );
}