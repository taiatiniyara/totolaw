/**
 * FAQ Page
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
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/help">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <Heading as="h1">Frequently Asked Questions</Heading>
          <p className="text-muted-foreground">
            Common questions and answers
          </p>
        </div>
      </div>

      {/* General Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            General Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I log in to Totolaw?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Totolaw uses passwordless authentication via magic links. Enter your email address on the login page, and you'll receive an email with a secure login link. Click the link to access your dashboard. No password needed!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What if I don&apos;t receive the login email?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <ul className="space-y-1 ml-4">
                  <li>• Check your spam/junk folder</li>
                  <li>• Verify you entered the correct email address</li>
                  <li>• Wait a few minutes and try again</li>
                  <li>• Contact your system administrator if the problem persists</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How do I switch between organisations?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                If you belong to multiple organisations, click the organisation dropdown at the top of the sidebar. Select the organisation you want to switch to. The dashboard will reload with that organisation's data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>What does my role determine?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Your role determines what you can see and do in the system. For example:
                <ul className="space-y-1 ml-4 mt-2">
                  <li>• <strong>Judges</strong> can manage all aspects of cases</li>
                  <li>• <strong>Court Clerks</strong> can create cases and schedule hearings</li>
                  <li>• <strong>Prosecutors</strong> can view and add evidence</li>
                  <li>• <strong>Administrators</strong> can manage users and settings</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Case Management */}
      <Card>
        <CardHeader>
          <CardTitle>Case Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="case-1">
              <AccordionTrigger>Why can&apos;t I create a case?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                You need the "cases:create" permission to create cases. This is typically granted to Court Clerks, Court Administrators, and Judges. Contact your administrator if you need this permission.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="case-2">
              <AccordionTrigger>How do I close a case?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                To close a case, open the case details page, click "Edit", change the status to "Closed" or "Dismissed", and save. You need the "cases:update" permission to do this.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="case-3">
              <AccordionTrigger>Can I edit a case after it&apos;s closed?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Yes, if you have the necessary permissions. However, it's best practice to finalize all details before closing a case. If you need to reopen a case, change its status back to "Active" or "In Progress".
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="case-4">
              <AccordionTrigger>What&apos;s the difference between case types?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Civil:</strong> Disputes between individuals or entities</li>
                  <li>• <strong>Criminal:</strong> Cases where the state prosecutes someone for a crime</li>
                  <li>• <strong>Family:</strong> Matters like divorce, custody, adoption</li>
                  <li>• <strong>Land:</strong> Property disputes and land rights</li>
                  <li>• <strong>Traffic:</strong> Traffic violations and related matters</li>
                  <li>• <strong>Administrative:</strong> Administrative law matters</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Hearings & Evidence */}
      <Card>
        <CardHeader>
          <CardTitle>Hearings & Evidence</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="hearing-1">
              <AccordionTrigger>Can I schedule multiple hearings for one case?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Yes! Cases often require multiple hearings. You can schedule as many hearings as needed for each case. View all hearings on the case details page or in the hearings calendar.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hearing-2">
              <AccordionTrigger>How do I reschedule a hearing?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Open the hearing details page, click "Edit" or "Reschedule", update the date/time/location, and save. Make sure to notify all parties about the change.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="evidence-1">
              <AccordionTrigger>What file types can I upload as evidence?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                You can upload most common file types including: PDF, Word documents, Excel spreadsheets, images (JPG, PNG, GIF), videos (MP4, AVI), audio files (MP3, WAV), and more. If you have trouble uploading a specific type, contact support.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="evidence-2">
              <AccordionTrigger>Is there a file size limit for evidence?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                File size limits depend on your organisation's configuration. Typically, individual files up to 50MB are supported. For larger files (like long videos), consider compressing them or contacting your administrator.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="evidence-3">
              <AccordionTrigger>Can I delete evidence after uploading?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Evidence can be deleted if you have the "evidence:delete" permission. However, this should be done carefully as it cannot be undone. Consider the legal implications before deleting any case-related evidence.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Security & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="security-1">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Yes. Totolaw uses industry-standard security measures including:
                <ul className="space-y-1 ml-4 mt-2">
                  <li>• Encrypted data storage and transmission</li>
                  <li>• Organisation-based data isolation</li>
                  <li>• Role-based access control</li>
                  <li>• Audit logging of all actions</li>
                  <li>• Regular security updates</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security-2">
              <AccordionTrigger>Can users from other organisations see my data?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                No. Totolaw implements strict data isolation between organisations. Users can only access data from organisations they belong to. Even system administrators follow proper protocols for accessing organisation-specific data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security-3">
              <AccordionTrigger>How long are my login sessions valid?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                For security reasons, login sessions expire after a period of inactivity. You'll need to log in again using a new magic link. This protects your account if you forget to log out on a shared device.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Still Have Questions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Still Have Questions?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you couldn't find the answer you're looking for, try these resources:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="outline" asChild>
                <Link href="/dashboard/help/getting-started">Getting Started Guide</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/help/troubleshooting">Troubleshooting</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/help/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/help">Help Center</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
