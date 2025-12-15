/**
 * Managed Lists Overview Page
 * 
 * System-wide list management (Super Admin only)
 */

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import { getAllManagedLists } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common";
import Link from "next/link";
import {
  List,
  Edit,
  Shield,
  Building2,
  FileText,
  Scale,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Database,
} from "lucide-react";

export default async function ManagedListsPage() {
  try {
    await requireSuperAdmin();
  } catch (error) {
    redirect("/dashboard/access-denied");
  }

  const result = await getAllManagedLists();

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Managed Lists"
          description="System-wide list management"
          icon={List}
        />
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Error loading managed lists</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { systemLists, stats } = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Managed Lists"
        description="Manage system-wide dropdown lists and options"
        icon={List}
      >
        <Badge variant="outline" className="text-purple-600 border-purple-600">
          Super Admin
        </Badge>
      </PageHeader>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5 text-blue-600" />
            About Managed Lists
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p className="text-muted-foreground">
            Managed Lists are system-wide dropdown options used across all organisations. 
            These lists control options for case types, statuses, hearing action types, and more.
          </p>
          <div className="flex items-start gap-2 text-blue-900">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-xs">
              <strong>Important:</strong> Changes to system lists affect all organisations immediately. 
              Exercise caution when modifying or deactivating items.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Lists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLists}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Across all lists</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeItems}</div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactive Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inactiveItems}</div>
            <p className="text-xs text-muted-foreground">Hidden from users</p>
          </CardContent>
        </Card>
      </div>

      {/* List Categories */}
      <div className="grid gap-4 md:grid-cols-2">
        {systemLists.map((list) => {
          const activeCount = list.items.filter(item => item.isActive !== false).length;
          const inactiveCount = list.items.length - activeCount;
          
          return (
            <Card key={list.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(list.category)}
                      {list.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {list.description || `Manage ${list.name.toLowerCase()}`}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {list.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">{activeCount} active</span>
                    </div>
                    {inactiveCount > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-muted-foreground">{inactiveCount} inactive</span>
                      </div>
                    )}
                  </div>

                  {/* Sample Items */}
                  <div className="flex flex-wrap gap-1">
                    {list.items.slice(0, 5).map((item) => (
                      <Badge 
                        key={item.id} 
                        variant={item.isActive !== false ? "secondary" : "outline"}
                        className={item.isActive === false ? "opacity-50" : ""}
                      >
                        {item.label}
                      </Badge>
                    ))}
                    {list.items.length > 5 && (
                      <Badge variant="outline">
                        +{list.items.length - 5} more
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <Link href={`/dashboard/system-admin/managed-lists/${list.category}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Manage Items
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Adding New Items</p>
              <p className="text-muted-foreground">
                Click "Manage Items" on any list to add new options. New items become available 
                immediately across all organisations.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Deactivating Items</p>
              <p className="text-muted-foreground">
                Mark items as inactive instead of deleting them. This hides them from dropdowns 
                but preserves historical data references.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">System Lists</p>
              <p className="text-muted-foreground">
                All lists shown here are system-wide. Changes affect all organisations and cannot 
                be overridden at the organisation level.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getCategoryIcon(category: string) {
  const icons: Record<string, React.ReactNode> = {
    court_levels: <Building2 className="h-5 w-5" />,
    case_types: <FileText className="h-5 w-5" />,
    case_statuses: <CheckCircle className="h-5 w-5" />,
    action_types: <Scale className="h-5 w-5" />,
    offense_types: <AlertCircle className="h-5 w-5" />,
    bail_decisions: <Shield className="h-5 w-5" />,
  };
  return icons[category] || <List className="h-5 w-5" />;
}
