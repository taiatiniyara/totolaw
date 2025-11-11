import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

export interface LinkCardProps {
  href: string;
  title: string;
  icon?: LucideIcon;
  showArrow?: boolean;
  children?: ReactNode;
}

export function LinkCard({
  href,
  title,
  icon: Icon,
  showArrow = true,
  children,
}: LinkCardProps) {
  return (
    <Link
      href={href}
      className="block p-3 rounded-lg border hover:bg-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
            {title}
          </p>
          {children}
        </div>
        {showArrow && (
          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </div>
    </Link>
  );
}
