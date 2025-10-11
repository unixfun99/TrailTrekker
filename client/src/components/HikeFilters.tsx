import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface HikeFiltersProps {
  onFilterChange?: (filters: any) => void;
}

export default function HikeFilters({ onFilterChange }: HikeFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "all",
    sortBy: "date"
  });

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = { search: "", difficulty: "all", sortBy: "date" };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
    console.log('Filters cleared');
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search trails..."
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-primary text-primary-foreground' : ''}
          data-testid="button-toggle-filters"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium">Difficulty</label>
            <Select value={filters.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
              <SelectTrigger data-testid="select-filter-difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger data-testid="select-sort-by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Recent</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            data-testid="button-clear-filters"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}