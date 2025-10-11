import StatsCard from '../StatsCard';
import { TrendingUp, MapPin, Clock, Users } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="p-4 grid grid-cols-2 gap-3 max-w-2xl">
      <StatsCard icon={TrendingUp} label="Total Hikes" value="24" />
      <StatsCard icon={MapPin} label="Miles Hiked" value="186.5" />
      <StatsCard icon={Clock} label="Hours Spent" value="82" />
      <StatsCard icon={Users} label="Shared Trails" value="12" />
    </div>
  );
}