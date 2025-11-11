"use client";

/**
 * Organisation Switcher Component
 * 
 * Dropdown to switch between organisations the user has access to
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
import { switchOrganisation } from "@/app/dashboard/actions";

interface Organisation {
  id: string;
  name: string;
  code: string;
  type: string;
  isPrimary?: boolean;
}

interface OrganisationSwitcherProps {
  organisations: Organisation[];
  currentOrganisationId: string | null | undefined;
}

export function OrganisationSwitcher({
  organisations,
  currentOrganisationId,
}: OrganisationSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentOrg = organisations.find(
    (org) => org.id === currentOrganisationId
  );

  const handleSwitch = async (organisationId: string) => {
    if (organisationId === currentOrganisationId) {
      setIsOpen(false);
      return;
    }

    startTransition(async () => {
      const result = await switchOrganisation(organisationId);
      
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        console.error("Failed to switch organisation:", result.error);
        // You could show a toast notification here
      }
    });
  };

  if (organisations.length === 0) {
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
              {currentOrg?.name || "Select organisation"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[300px]">
        <DropdownMenuLabel>Switch Organisation</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organisations.map((org) => {
          const isActive = org.id === currentOrganisationId;
          
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
