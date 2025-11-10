"use client";

/**
 * Organization Switcher Component
 * 
 * Dropdown to switch between organizations the user has access to
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { switchOrganization } from "@/app/dashboard/actions";

interface Organization {
  id: string;
  name: string;
  code: string;
  type: string;
  isPrimary?: boolean;
}

interface OrganizationSwitcherProps {
  organizations: Organization[];
  currentOrganizationId: string | null | undefined;
}

export function OrganizationSwitcher({
  organizations,
  currentOrganizationId,
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentOrg = organizations.find(
    (org) => org.id === currentOrganizationId
  );

  const handleSwitch = async (organizationId: string) => {
    if (organizationId === currentOrganizationId) {
      setIsOpen(false);
      return;
    }

    startTransition(async () => {
      const result = await switchOrganization(organizationId);
      
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        console.error("Failed to switch organization:", result.error);
        // You could show a toast notification here
      }
    });
  };

  if (organizations.length === 0) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
          disabled={isPending}
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">
              {currentOrg?.name || "Select organization"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[300px]">
        <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => {
          const isActive = org.id === currentOrganizationId;
          
          return (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleSwitch(org.id)}
              className="cursor-pointer"
              disabled={isPending}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">{org.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {org.code} • {org.type}
                  </span>
                </div>
                {isActive && <Check className="h-4 w-4" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
