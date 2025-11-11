/**
 * Getting Started Guide
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  CheckCircle,
  Mail,
  Layout,
  FolderOpen,
  Calendar,
  Upload,
  Search,
  Shield,
  Info,
} from "lucide-react";

export default function GettingStartedPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/help">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <Heading as="h1">Getting Started with Totolaw</Heading>
          <p className="text-muted-foreground">
            Everything you need to know to start using Totolaw
          </p>
        </div>
      </div>

      {/* Welcome */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Welcome to Totolaw! This guide will help you understand the basics of the platform and get you started with managing court cases effectively.
        </AlertDescription>
      </Alert>

      {/* What is Totolaw */}
      <Card>
        <CardHeader>
          <CardTitle>What is Totolaw?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            Totolaw is a comprehensive case management platform designed specifically for Pacific Island court systems. It helps you:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Track and manage court cases from filing to resolution</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Schedule and organize court hearings</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Upload and manage case evidence and documents</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Search across cases, hearings, and documents</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Collaborate with team members securely</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* First Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Your First Steps</CardTitle>
          <CardDescription>Complete these steps to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-semibold mb-1 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Access the Platform
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  You'll receive a magic link via email to log in. Click the link in the email to access your dashboard securely without needing a password.
                </p>
                <Badge variant="secondary">Passwordless Authentication</Badge>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-semibold mb-1 flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Explore the Dashboard
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  The dashboard is your home page, showing:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Total cases and their statuses</li>
                  <li>• Upcoming hearings</li>
                  <li>• Recent case activity</li>
                  <li>• Quick access to all features</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-semibold mb-1 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Understand Your Role
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Your role determines what you can see and do in the system. Common roles include:
                </p>
                <div className="grid gap-2 text-sm">
                  <div className="border rounded-lg p-2">
                    <strong>Judge:</strong> Full case management and decision-making
                  </div>
                  <div className="border rounded-lg p-2">
                    <strong>Court Clerk:</strong> Create cases, schedule hearings, upload documents
                  </div>
                  <div className="border rounded-lg p-2">
                    <strong>Court Administrator:</strong> User management and system configuration
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                4
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-semibold mb-1">Start Using Features</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Based on your role, you can:
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link href="/dashboard/cases/new">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Create a Case
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link href="/dashboard/hearings/new">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule a Hearing
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link href="/dashboard/evidence/upload">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Evidence
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link href="/dashboard/search">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <Card>
        <CardHeader>
          <CardTitle>Key Concepts</CardTitle>
          <CardDescription>Important terms and concepts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold mb-1">Organization</h4>
              <p className="text-sm text-muted-foreground">
                Your court system (e.g., Fiji High Court, Samoa Magistrate Court). All data is organized by organization to keep things secure and separate.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold mb-1">Case</h4>
              <p className="text-sm text-muted-foreground">
                A legal matter being handled by the court. Each case has details like case number, parties involved, type, status, and related documents.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold mb-1">Hearing</h4>
              <p className="text-sm text-muted-foreground">
                A scheduled court session for a specific case. Includes date, time, location, and assigned judge.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold mb-1">Evidence</h4>
              <p className="text-sm text-muted-foreground">
                Documents, photos, or files related to a case. All evidence is securely stored and associated with specific cases.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold mb-1">Permissions</h4>
              <p className="text-sm text-muted-foreground">
                What you're allowed to do in the system (create, read, update, delete). These are tied to your role.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Tips</CardTitle>
          <CardDescription>Shortcuts to help you work faster</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 border rounded">
              <span>Quick search anywhere</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + K</kbd>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span>Switch organizations</span>
              <span className="text-muted-foreground">Click dropdown at top of sidebar</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span>Back to dashboard</span>
              <span className="text-muted-foreground">Click logo or "Dashboard" in menu</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span>Mobile menu</span>
              <span className="text-muted-foreground">Click hamburger icon (☰)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Ready to Learn More?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/cases">
                Learn About Case Management
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/hearings">
                Learn About Hearings
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/roles-permissions">
                Understand Roles & Permissions
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/faq">
                View FAQ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
