"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Calendar, 
  FileText, 
  Search, 
  Users, 
  Settings, 
  Shield,
  HelpCircle
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  FileText,
  Search,
  Users,
  Settings,
  Shield,
  HelpCircle,
};

type IconName = keyof typeof iconMap;

interface NavLinkProps {
  href: string;
  icon: IconName;
  children: React.ReactNode;
  badge?: string;
}

export function NavLink({ href, icon: iconName, children, badge }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  const Icon = iconMap[iconName];

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
          {badge}
        </span>
      )}
    </Link>
  );
}
