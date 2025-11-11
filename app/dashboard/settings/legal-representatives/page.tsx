/**
 * Legal Representatives Management Page
 * 
 * Directory of lawyers, law firms, and legal aid
 */

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState } from "@/components/common";
import { getLegalRepresentatives } from "./actions";
import { Plus, Scale, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function LegalRepresentativesPage() {
  const result = await getLegalRepresentatives();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Legal Representatives"
        description="Directory of lawyers, law firms, and legal aid organizations"
      >
        <Button asChild>
          <Link href="/dashboard/settings/legal-representatives/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Representative
          </Link>
        </Button>
      </PageHeader>

      {/* Representatives List */}
      {!result.success ? (
        <EmptyState
          icon={Scale}
          title="Error loading legal representatives"
          description={result.error || "An error occurred"}
        />
      ) : result.data && result.data.length > 0 ? (
        <div className="grid gap-4">
          {result.data.map((rep) => (
            <Card key={rep.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{rep.name}</CardTitle>
                    <CardDescription>
                      {rep.firmName && rep.firmName !== rep.name && rep.firmName}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{rep.type.replace("_", " ")}</Badge>
                    <Badge variant={rep.isActive ? "default" : "secondary"}>
                      {rep.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm">
                  {rep.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {rep.email}
                    </div>
                  )}
                  {rep.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {rep.phone}
                    </div>
                  )}
                  {rep.practiceAreas && rep.practiceAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(rep.practiceAreas as string[]).map((area, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/settings/legal-representatives/${rep.id}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Scale}
          title="No legal representatives yet"
          description="Add legal representatives to track counsel in cases"
        >
          <Button asChild>
            <Link href="/dashboard/settings/legal-representatives/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Representative
            </Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
