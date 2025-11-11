/**
 * Help & Documentation Hub
 * 
 * Central hub for user guides and documentation
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  BookOpen,
  FileText,
  Calendar,
  Upload,
  Users,
  Search,
  Settings,
  Shield,
  HelpCircle,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading as="h1">Help & Documentation</Heading>
          <p className="text-muted-foreground mt-1">
            Learn how to use Totolaw effectively
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="https://github.com/taiatiniyara/totolaw" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            GitHub Repository
          </Link>
        </Button>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>
            New to Totolaw? Start here to learn the basics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link 
              href="/dashboard/help/getting-started" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Getting Started</p>
                  <p className="text-sm text-muted-foreground">Learn the basics and set up your account</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
            <Link 
              href="/dashboard/help/navigation" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Navigating the Dashboard</p>
                  <p className="text-sm text-muted-foreground">Understand the layout and navigation</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
            <Link 
              href="/dashboard/help/roles-permissions" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Roles & Permissions</p>
                  <p className="text-sm text-muted-foreground">Understand your access level and capabilities</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Feature Guides */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Feature Guides</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <Link href="/dashboard/help/cases">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Case Management</CardTitle>
                <CardDescription>
                  Create, track, and manage court cases
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <Link href="/dashboard/help/hearings">
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Hearings</CardTitle>
                <CardDescription>
                  Schedule and manage court hearings
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <Link href="/dashboard/help/evidence">
              <CardHeader>
                <Upload className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Evidence & Documents</CardTitle>
                <CardDescription>
                  Upload and organize case evidence
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <Link href="/dashboard/help/search">
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Search</CardTitle>
                <CardDescription>
                  Find cases, hearings, and documents
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <Link href="/dashboard/help/users">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">User Management</CardTitle>
                <CardDescription>
                  Manage users and team members
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <Link href="/dashboard/help/settings">
              <CardHeader>
                <Settings className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>
                  Configure your preferences
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>
              Learn about data security and access controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard/help/security" className="block text-sm text-primary hover:underline">
                Security Features
              </Link>
              <Link href="/dashboard/help/privacy" className="block text-sm text-primary hover:underline">
                Privacy Policy
              </Link>
              <Link href="/dashboard/help/data-retention" className="block text-sm text-primary hover:underline">
                Data Retention
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support
            </CardTitle>
            <CardDescription>
              Get help when you need it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard/help/faq" className="block text-sm text-primary hover:underline">
                Frequently Asked Questions
              </Link>
              <Link href="/dashboard/help/troubleshooting" className="block text-sm text-primary hover:underline">
                Troubleshooting Guide
              </Link>
              <Link href="/dashboard/help/contact" className="block text-sm text-primary hover:underline">
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Tip of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            <strong>Keyboard Shortcut:</strong> Use <kbd className="px-2 py-1 bg-background rounded border">Ctrl + K</kbd> (or <kbd className="px-2 py-1 bg-background rounded border">Cmd + K</kbd> on Mac) to quickly access the search feature from anywhere in the application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
