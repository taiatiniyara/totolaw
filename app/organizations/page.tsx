import { Metadata } from "next";
import { getPublicOrganizations } from "./actions";
import { OrganizationHierarchy } from "@/components/organization-hierarchy";
import { LandingHeader } from "@/components/landing-header";
import { Heading } from "@/components/ui/heading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Organizations | Totolaw",
  description: "View the organizational hierarchy of Pacific Island court systems using Totolaw",
};

export default async function OrganizationsPage() {
  const result = await getPublicOrganizations();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <LandingHeader variant="home" />

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>

              <div className="flex items-center gap-3">
                <Building2 className="h-10 w-10 text-blue-600" />
                <div>
                  <Heading as="h1" className="text-3xl md:text-5xl">
                    Organizations
                  </Heading>
                  <p className="text-lg text-muted-foreground mt-2">
                    Pacific Island court systems and judicial organizations using Totolaw
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            {!result.success || !result.organizations ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {result.error || "Failed to load organizations"}
                </AlertDescription>
              </Alert>
            ) : (
              <OrganizationHierarchy organizations={result.organizations} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for Pacific Island Court Systems
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2025 Totolaw. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
