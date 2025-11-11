"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Key } from "lucide-react";

interface Permission {
  id: string;
  resource: string;
  action: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
}

interface PermissionsSearchProps {
  permissions: Permission[];
  permissionsByResource: Record<string, Permission[]>;
  actionColors: Record<string, string>;
}

export function PermissionsSearch({ 
  permissions, 
  permissionsByResource,
  actionColors 
}: PermissionsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPermissions = permissions.filter((perm) => {
    const query = searchQuery.toLowerCase();
    return (
      perm.slug.toLowerCase().includes(query) ||
      perm.resource.toLowerCase().includes(query) ||
      perm.action.toLowerCase().includes(query) ||
      perm.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search permissions by name, resource, action, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {searchQuery && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">
                Search Results
              </h3>
              <Badge variant="secondary">
                {filteredPermissions.length} found
              </Badge>
            </div>

            {filteredPermissions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No permissions found matching "{searchQuery}"
              </p>
            ) : (
              <div className="space-y-2">
                {filteredPermissions.map((perm) => (
                  <div
                    key={perm.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <Key className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {perm.slug}
                        </code>
                        <Badge 
                          variant="secondary"
                          className={actionColors[perm.action] || ""}
                        >
                          {perm.action}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {perm.resource}
                        </Badge>
                      </div>
                      {perm.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {perm.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
