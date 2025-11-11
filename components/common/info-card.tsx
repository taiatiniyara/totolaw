import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

export interface InfoCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  href?: string;
  clickable?: boolean;
  children?: ReactNode;
}

export function InfoCard({
  title,
  description,
  icon: Icon,
  href,
  clickable = true,
  children,
}: InfoCardProps) {
  const cardContent = (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </>
  );

  if (href) {
    return (
      <Link href={href}>
        <Card className={clickable ? "hover:bg-accent cursor-pointer transition-colors" : ""}>
          {cardContent}
        </Card>
      </Link>
    );
  }

  return (
    <Card className={clickable ? "hover:bg-accent cursor-pointer transition-colors" : ""}>
      {cardContent}
    </Card>
  );
}
