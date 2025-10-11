import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
}

export default function StatsCard({ icon: Icon, label, value, iconColor = "text-primary" }: StatsCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-outfit font-semibold" data-testid="text-stat-value">{value}</p>
          <p className="text-sm text-muted-foreground" data-testid="text-stat-label">{label}</p>
        </div>
      </div>
    </Card>
  );
}