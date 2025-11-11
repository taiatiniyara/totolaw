import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline" | "destructive";
  };
  children?: ReactNode;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-primary",
  badge,
  children,
}: StatCardProps) {
  const bgColor = iconColor.replace("text-", "bg-").replace("-500", "-500/10");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`h-9 w-9 rounded-full ${bgColor} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {badge && (
          <Badge variant={badge.variant || "secondary"} className="mt-2">
            {badge.label}
          </Badge>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
