/**
 * Public FAQ Page
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LandingHeader } from "@/components/landing-header";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader variant="docs" />
      
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/docs">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Documentation
                </Link>
              </Button>
              
              <div className="space-y-2">
                <Heading as="h1" className="text-4xl flex items-center gap-3">
                  <HelpCircle className="h-10 w-10" />
                  Frequently Asked Questions
                </Heading>
                <p className="text-lg text-muted-foreground">
                  Find answers to common questions about Totolaw
                </p>
              </div>
            </div>

            {/* General Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">General Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="what-is-totolaw">
                    <AccordionTrigger>What is Totolaw?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        <strong>Totolaw</strong> comes from the Fijian word <strong>"Totolo"</strong> meaning "fast" or "quick". 
                        It's a comprehensive case management system designed specifically for Pacific Island court systems, 
                        enabling faster, more efficient justice delivery. It helps courts, legal professionals, and administrative 
                        staff organize cases, schedule hearings, manage evidence, and collaborate effectively.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="who-can-use">
                    <AccordionTrigger>Who can use Totolaw?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Totolaw is designed for:
                      </p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>Court administrators and clerks</li>
                        <li>Judges and magistrates</li>
                        <li>Legal professionals and attorneys</li>
                        <li>Court staff and support personnel</li>
                      </ul>
                      <p>
                        Each user is assigned a role with appropriate permissions based on their responsibilities.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cost">
                    <AccordionTrigger>How much does Totolaw cost?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Totolaw pricing varies based on your organisation's size and needs. Contact your system administrator
                        or reach out to our sales team for specific pricing information for your court or organisation.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="getting-started">
                    <AccordionTrigger>How do I get started?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        To get started with Totolaw:
                      </p>
                      <ol className="list-decimal ml-6 space-y-1">
                        <li>Request access from your system administrator</li>
                        <li>Receive your invitation email</li>
                        <li>Use the magic link to sign in securely</li>
                        <li>Explore the dashboard and feature guides</li>
                      </ol>
                      <p>
                        Check out our <Link href="/docs/getting-started" className="text-primary hover:underline">Getting Started Guide</Link> for more details.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="support">
                    <AccordionTrigger>How do I get support?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Support options include:
                      </p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>In-app documentation and guides</li>
                        <li>Contact your system administrator for organisation-specific help</li>
                        <li>Email support@totolaw.com for technical issues</li>
                        <li>Browse this FAQ for common questions</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Case Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Case Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="create-case">
                    <AccordionTrigger>How do I create a new case?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Navigate to the Cases section and click "New Case". Fill in the required details including case number,
                        title, parties, and status. Save to create the case. See our <Link href="/docs/cases" className="text-primary hover:underline">Case Management Guide</Link> for detailed instructions.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="edit-case">
                    <AccordionTrigger>Can I edit a case after creating it?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Yes, you can edit case details at any time if you have the appropriate permissions. Open the case and 
                        click "Edit" to update information. All changes are tracked in the case history.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="delete-case">
                    <AccordionTrigger>Can I delete a case?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Only system administrators can permanently delete cases. If you need to remove a case, contact your 
                        administrator. Alternatively, you can close or archive cases to remove them from active view.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="case-statuses">
                    <AccordionTrigger>What do the different case statuses mean?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <ul className="space-y-2">
                        <li><strong>Open:</strong> Case has been filed but not yet started</li>
                        <li><strong>In Progress:</strong> Case is actively being worked on</li>
                        <li><strong>Pending:</strong> Waiting for external action or information</li>
                        <li><strong>Closed:</strong> Case has been resolved</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="search-cases">
                    <AccordionTrigger>How do I search for a specific case?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Use the Search feature in the sidebar or the search bar on the Cases page. You can search by case number,
                        title, parties, or other details. Advanced filters help narrow down results.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Hearings & Evidence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Hearings & Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="schedule-hearing">
                    <AccordionTrigger>How do I schedule a hearing?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Go to the Hearings section and click "New Hearing". Select the case, set the date and time, add location 
                        details, and save. The hearing will appear on the calendar. See our <Link href="/docs/hearings" className="text-primary hover:underline">Hearings Guide</Link> for more information.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="reschedule-hearing">
                    <AccordionTrigger>Can I reschedule a hearing?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Yes, if you have the necessary permissions. Open the hearing details and click "Edit" to change the 
                        date, time, or location. All participants will see the updated information.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="upload-evidence">
                    <AccordionTrigger>What types of files can I upload as evidence?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Totolaw supports various file types including:
                      </p>
                      <ul className="list-disc ml-6">
                        <li>Documents: PDF, DOC, DOCX, TXT, RTF</li>
                        <li>Images: JPG, PNG, GIF, WEBP</li>
                        <li>Video: MP4, MOV, AVI, WEBM</li>
                        <li>Audio: MP3, WAV, M4A, OGG</li>
                      </ul>
                      <p className="mt-2">
                        Maximum file size is 100MB per file. See our <Link href="/docs/evidence" className="text-primary hover:underline">Evidence Guide</Link> for details.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="evidence-security">
                    <AccordionTrigger>How secure is uploaded evidence?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        All evidence is encrypted both at rest and in transit using industry-standard encryption. Access is 
                        controlled by role-based permissions, and all file access is logged for audit purposes. Only authorized
                        users within your organisation can view evidence.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="calendar-view">
                    <AccordionTrigger>How do I view upcoming hearings on a calendar?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Navigate to the Hearings section and select "Calendar View" (if available). You'll see all scheduled 
                        hearings in a monthly calendar format. Click any hearing to view full details or make changes.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Security & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="data-security">
                    <AccordionTrigger>How is my data protected?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Totolaw uses multiple layers of security:
                      </p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>End-to-end encryption for all data</li>
                        <li>Secure authentication with magic links</li>
                        <li>Role-based access control</li>
                        <li>Regular security audits</li>
                        <li>Comprehensive audit logging</li>
                        <li>SOC 2 compliant infrastructure</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="user-roles">
                    <AccordionTrigger>What are the different user roles?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Totolaw has several user roles:
                      </p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li><strong>Admin:</strong> Full access to all features and settings</li>
                        <li><strong>Manager:</strong> Can manage cases, users, and most features</li>
                        <li><strong>Staff:</strong> Can create and edit cases and hearings</li>
                        <li><strong>Viewer:</strong> Read-only access to assigned cases</li>
                      </ul>
                      <p className="mt-2">
                        Your role is assigned by your organisation's administrator based on your responsibilities.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="magic-links">
                    <AccordionTrigger>What are magic links and how do they work?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Magic links are a passwordless authentication method. Instead of remembering a password, you receive
                        a secure link via email. Click the link to sign in instantly. Links expire after a short time for security.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="multi-tenant">
                    <AccordionTrigger>What does "multi-tenant" mean?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Multi-tenant means each court or organisation has its own isolated space within Totolaw. Your data is
                        completely separate from other organisations. You can only see cases and information from your own organisation.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="data-backup">
                    <AccordionTrigger>Is my data backed up?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Yes, all data is automatically backed up daily. Multiple backup copies are stored in geographically
                        distributed locations to ensure data durability and disaster recovery capabilities.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Technical Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Technical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="browser-support">
                    <AccordionTrigger>Which browsers are supported?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Totolaw works best on modern browsers:
                      </p>
                      <ul className="list-disc ml-6">
                        <li>Google Chrome (recommended)</li>
                        <li>Mozilla Firefox</li>
                        <li>Microsoft Edge</li>
                        <li>Safari (macOS and iOS)</li>
                      </ul>
                      <p className="mt-2">
                        We recommend using the latest version of your preferred browser for the best experience.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="mobile">
                    <AccordionTrigger>Can I use Totolaw on mobile devices?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        Yes! Totolaw is fully responsive and works on smartphones and tablets. The mobile interface is optimized
                        for smaller screens while maintaining full functionality.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="login-issues">
                    <AccordionTrigger>What if I can't sign in?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        If you're having trouble signing in:
                      </p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>Check your email (including spam folder) for the magic link</li>
                        <li>Make sure you're using the correct email address</li>
                        <li>Request a new magic link if the previous one expired</li>
                        <li>Contact your system administrator if you still can't access your account</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="slow-performance">
                    <AccordionTrigger>Why is the app running slowly?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        If Totolaw seems slow:
                      </p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>Check your internet connection</li>
                        <li>Close unnecessary browser tabs</li>
                        <li>Clear your browser cache</li>
                        <li>Try using a different browser</li>
                        <li>Contact support if the issue persists</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="error-messages">
                    <AccordionTrigger>What should I do if I see an error message?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                      <p>
                        If you encounter an error:
                      </p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>Take a screenshot of the error message</li>
                        <li>Note what action you were performing</li>
                        <li>Try refreshing the page</li>
                        <li>Contact support with the error details if it continues</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Still Need Help */}
            <Card className="border-primary">
              <CardContent className="p-6 text-center space-y-4">
                <h3 className="text-2xl font-semibold">Still Have Questions?</h3>
                <p className="text-muted-foreground">
                  Can't find what you're looking for? Check out our other guides or contact support.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/docs/getting-started">Getting Started</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/docs/cases">Case Management</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/docs">All Guides</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
