import { ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  backButton?: {
    href: string;
    label?: string;
  };
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  action,
  backButton,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        {backButton && (
          <Button variant="ghost" size="icon" asChild>
            <Link href={backButton.href}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">{backButton.label || "Go back"}</span>
            </Link>
          </Button>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-6 w-6" />}
            <Heading as="h1">{title}</Heading>
          </div>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <div>
          {action.href ? (
            <Button asChild size="sm">
              <Link href={action.href}>
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button onClick={action.onClick} size="sm">
              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
