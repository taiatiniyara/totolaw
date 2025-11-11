import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export interface ListItemCardProps {
  title: string;
  description?: string | ReactNode;
  icon?: LucideIcon;
  action?: {
    label: string;
    href: string;
    variant?: "default" | "outline" | "ghost";
  };
  children?: ReactNode;
}

export function ListItemCard({
  title,
  description,
  icon: Icon,
  action,
  children,
}: ListItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2">
              {Icon && <Icon className="h-5 w-5" />}
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action && (
            <Button asChild variant={action.variant || "outline"} size="sm">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          )}
        </div>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}
