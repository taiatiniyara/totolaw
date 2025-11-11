import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface DataRowProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline" | "destructive";
    color?: string;
  };
  onClick?: () => void;
  children?: ReactNode;
}

export function DataRow({
  icon: Icon,
  title,
  subtitle,
  badge,
  onClick,
  children,
}: DataRowProps) {
  const baseClasses = "flex items-center justify-between p-3 border rounded-lg";
  const interactiveClasses = onClick
    ? "hover:bg-accent/50 cursor-pointer transition-colors"
    : "";

  return (
    <div
      className={`${baseClasses} ${interactiveClasses}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        <div>
          <div className="font-medium">{title}</div>
          {subtitle && (
            <div className="text-sm text-muted-foreground">{subtitle}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <Badge
            variant={badge.variant || "outline"}
            className={badge.color}
          >
            {badge.label}
          </Badge>
        )}
        {children}
      </div>
    </div>
  );
}
