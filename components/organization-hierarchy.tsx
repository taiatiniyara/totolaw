"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronRight } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string | null;
  parentId: string | null;
  createdAt: Date;
}

interface OrganizationHierarchyProps {
  organizations: Organization[];
}

interface OrganizationNode extends Organization {
  children: OrganizationNode[];
}

// Build tree structure from flat list
function buildTree(organizations: Organization[]): OrganizationNode[] {
  const orgMap = new Map<string, OrganizationNode>();
  const roots: OrganizationNode[] = [];

  // Create nodes
  organizations.forEach((org) => {
    orgMap.set(org.id, { ...org, children: [] });
  });

  // Build tree
  organizations.forEach((org) => {
    const node = orgMap.get(org.id)!;
    if (org.parentId) {
      const parent = orgMap.get(org.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        // Parent not found or inactive, treat as root
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function OrganizationTreeNode({ node, level = 0 }: { node: OrganizationNode; level?: number }) {
  const hasChildren = node.children.length > 0;
  const indent = level * 24;

  return (
    <div className="space-y-2">
      <div
        className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        style={{ marginLeft: `${indent}px` }}
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          {level > 0 && (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
          <Building2 className={`h-6 w-6 ${level === 0 ? 'text-blue-600' : 'text-primary'}`} />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-semibold ${level === 0 ? 'text-lg' : ''}`}>
              {node.name}
            </h3>
            <Badge variant="secondary" className="font-mono text-xs">
              {node.code}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {node.type}
            </Badge>
            {hasChildren && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {node.children.length} sub-org{node.children.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          {node.description && (
            <p className="text-sm text-muted-foreground">
              {node.description}
            </p>
          )}
        </div>
      </div>

      {hasChildren && (
        <div className="space-y-2">
          {node.children.map((child) => (
            <OrganizationTreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrganizationHierarchy({ organizations }: OrganizationHierarchyProps) {
  const tree = buildTree(organizations);

  // Statistics
  const totalOrgs = organizations.length;
  const topLevelOrgs = tree.length;
  const orgTypes = [...new Set(organizations.map(o => o.type))];
  const countries = organizations.filter(o => o.type === 'country').length;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrgs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top-Level Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topLevelOrgs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organization Types</CardTitle>
            <Badge variant="outline">{orgTypes.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orgTypes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {orgTypes.slice(0, 3).join(", ")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries/Regions</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countries}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tree View */}
      <Card>
        <CardHeader>
          <CardTitle>Organizational Hierarchy</CardTitle>
          <CardDescription>
            Complete structure of all active organizations and their relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tree.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No organizations found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tree.map((node) => (
                <OrganizationTreeNode key={node.id} node={node} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span className="text-muted-foreground">Top-level organization (no parent)</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <Building2 className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Sub-organization (has parent)</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              2 sub-orgs
            </Badge>
            <span className="text-muted-foreground">Number of child organizations</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
