/**
 * Managed List Editor Page
 * 
 * Edit items in a specific managed list category
 */

import { redirect, notFound } from "next/navigation";
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import { getManagedListByCategory } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common";
import { ManagedListEditor } from "./managed-list-editor";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  List,
  ArrowLeft,
  AlertCircle,
  Info,
} from "lucide-react";

export default async function ManagedListDetailPage({
  params,
}: {
  params: { category: string };
}) {
  try {
    await requireSuperAdmin();
  } catch (error) {
    redirect("/dashboard/access-denied");
  }

  const result = await getManagedListByCategory(params.category);

  if (!result.success || !result.data) {
    notFound();
  }

  const list = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={list.name}
        description={list.description || `Manage ${list.name.toLowerCase()} options`}
        icon={List}
      >
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            Super Admin
          </Badge>
          <Badge variant="secondary">{list.category}</Badge>
        </div>
      </PageHeader>

      {/* Back Button */}
      <Link href="/dashboard/system-admin/managed-lists">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Lists
        </Button>
      </Link>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-5 w-5 text-blue-600" />
            List Management
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="space-y-1">
            <p className="text-muted-foreground">
              This is a <strong>system-wide list</strong>. Changes made here will be immediately 
              visible to all organisations and users.
            </p>
            <div className="flex items-start gap-2 text-blue-900 mt-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs">
                <strong>Important:</strong> Items marked as inactive will be hidden from 
                dropdowns but existing data references will be preserved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List Editor */}
      <ManagedListEditor
        listId={list.id}
        category={list.category}
        name={list.name}
        items={list.items}
      />

      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div>
            <p className="font-semibold mb-1">Value</p>
            <p className="text-muted-foreground">
              The internal code/key used in the database (e.g., "high_court", "PENDING"). 
              Use lowercase with underscores for consistency.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">Label</p>
            <p className="text-muted-foreground">
              The user-friendly display text shown in dropdowns (e.g., "High Court", "Pending"). 
              Use proper capitalization.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">Description</p>
            <p className="text-muted-foreground">
              Optional additional context shown in tooltips or help text.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">Sort Order</p>
            <p className="text-muted-foreground">
              Controls the display order in dropdowns. Lower numbers appear first. 
              You can also drag to reorder items.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">Active Status</p>
            <p className="text-muted-foreground">
              Inactive items are hidden from users but preserve data integrity for existing records. 
              Use this instead of deleting items.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
