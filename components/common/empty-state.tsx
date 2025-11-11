import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Icon className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <Heading as="h3" className="mb-2">
          {title}
        </Heading>
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
          {description}
        </p>
        {action && (
          <Button asChild>
            <Link href={action.href}>
              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
              {action.label}
            </Link>
          </Button>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
