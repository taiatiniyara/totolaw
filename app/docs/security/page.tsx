/**
 * Multi-Tenant Security User Manual
 * 
 * Public documentation page explaining security and data isolation
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import {
  Shield,
  Lock,
  Database,
  Building2,
  CheckCircle,
  XCircle,
  ArrowRight,
  BookOpen,
  Home,
  AlertCircle,
  Eye,
  Users,
  Server,
  FileText,
  Key,
} from "lucide-react";

export default function SecurityDocumentationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader variant="docs" />
      
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Shield className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <Heading as="h1" className="text-4xl md:text-5xl">
                Multi-Tenant Security
              </Heading>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Understanding how Totolaw keeps your organisation's data secure and isolated
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" asChild size="sm">
                  <Link href="/docs">
                    <BookOpen className="mr-2 h-4 w-4" />
                    All Docs
                  </Link>
                </Button>
                <Button variant="outline" asChild size="sm">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
              </div>
            </div>

            {/* What is Multi-Tenancy */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <Heading as="h2" className="text-3xl">What is Multi-Tenancy?</Heading>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg mb-4">
                    <strong>Multi-tenancy</strong> means multiple organisations (called "tenants") use the same Totolaw 
                    platform, but each organisation's data is completely separate and secure. Think of it like an apartment 
                    building: everyone shares the same building (platform), but each apartment (organisation) is private and locked.
                  </p>
                  
                  <div className="bg-muted p-6 rounded-lg space-y-4 mt-6">
                    <p className="font-semibold text-lg">Real-World Example:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          <p className="font-semibold text-blue-900">High Court of Fiji</p>
                        </div>
                        <ul className="text-sm space-y-1 text-blue-700">
                          <li>• Has 50 cases</li>
                          <li>• 15 staff members</li>
                          <li>• 200 documents</li>
                          <li>• Cannot see Magistrates Court data</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-5 w-5 text-green-600" />
                          <p className="font-semibold text-green-900">Magistrates Court</p>
                        </div>
                        <ul className="text-sm space-y-1 text-green-700">
                          <li>• Has 120 cases</li>
                          <li>• 25 staff members</li>
                          <li>• 500 documents</li>
                          <li>• Cannot see High Court data</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mt-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-900">
                          Both organisations use the same Totolaw platform, but they cannot access each other's data. 
                          Each organisation is completely isolated.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* How Data Isolation Works */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <Heading as="h2" className="text-3xl">How Data Isolation Works</Heading>
              </div>

              <div className="grid gap-6">
                {/* Organisation Filtering */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-7 w-7 text-blue-600" />
                      <div>
                        <CardTitle className="text-xl">Automatic Organisation Filtering</CardTitle>
                        <CardDescription className="text-base">
                          Every query is automatically scoped to your current organisation
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">
                        When you view cases, hearings, documents, or any data in Totolaw, the system automatically 
                        filters to show only data from your current organisation. You never accidentally see another 
                        organisation's information.
                      </p>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="font-semibold text-sm mb-3">Example: Viewing Cases</p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">1</span>
                            <span className="text-muted-foreground">You navigate to the Cases page</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">2</span>
                            <span className="text-muted-foreground">System checks: Which organisation are you viewing?</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">3</span>
                            <span className="text-muted-foreground">Database query includes: <code className="bg-background px-1 rounded">WHERE organisation_id = 'your-org-id'</code></span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">✓</span>
                            <span className="font-semibold text-green-700">Result: You only see YOUR organisation's cases</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Organisation Context */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Key className="h-7 w-7 text-purple-600" />
                      <div>
                        <CardTitle className="text-xl">Organisation Context</CardTitle>
                        <CardDescription className="text-base">
                          Your session always knows which organisation you're working in
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">
                        When you log in, the system establishes your "organisation context" - which organisation you're 
                        currently working in. This context is used for every action you take.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <p className="font-semibold text-sm mb-2 text-blue-900">Single Organisation User</p>
                          <ul className="text-xs space-y-1 text-blue-700">
                            <li>• Automatically set to your organisation</li>
                            <li>• No switching needed</li>
                            <li>• Simple and straightforward</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                          <p className="font-semibold text-sm mb-2 text-purple-900">Multiple Organisation User</p>
                          <ul className="text-xs space-y-1 text-purple-700">
                            <li>• Use organisation switcher in navigation</li>
                            <li>• Context changes when you switch</li>
                            <li>• All data updates to new organisation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Database Level Isolation */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Server className="h-7 w-7 text-green-600" />
                      <div>
                        <CardTitle className="text-xl">Database-Level Security</CardTitle>
                        <CardDescription className="text-base">
                          Multiple layers of protection at the database level
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Foreign Key Constraints</p>
                          <p className="text-xs text-muted-foreground">
                            Every record is linked to an organisation ID. You cannot create data without an organisation.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Indexed Queries</p>
                          <p className="text-xs text-muted-foreground">
                            Organisation ID is indexed for fast, secure filtering on every query.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Cascading Deletes</p>
                          <p className="text-xs text-muted-foreground">
                            If an organisation is removed, all its data is automatically cleaned up.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">No Cross-Organisation Queries</p>
                          <p className="text-xs text-muted-foreground">
                            It's technically impossible to query data across organisations (except for Super Admins).
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* What is Protected */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <Heading as="h2" className="text-3xl">What Data is Protected</Heading>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <FileText className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle className="text-base">Cases</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>All case records, details, status, parties, and case history are isolated per organisation.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Database className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle className="text-base">Hearings</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>Scheduled hearings, courtrooms, cause lists, and hearing outcomes are organisation-specific.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <FileText className="h-8 w-8 text-purple-600 mb-2" />
                    <CardTitle className="text-base">Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>All uploaded documents, evidence files, and attachments are isolated and encrypted.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Users className="h-8 w-8 text-orange-600 mb-2" />
                    <CardTitle className="text-base">Users</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>User roles, permissions, and access are scoped to each organisation separately.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Shield className="h-8 w-8 text-red-600 mb-2" />
                    <CardTitle className="text-base">Audit Logs</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>All activity logs, changes, and audit trails are kept separate per organisation.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Database className="h-8 w-8 text-teal-600 mb-2" />
                    <CardTitle className="text-base">Evidence</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>Evidence items, transcripts, and recordings are securely isolated per organisation.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Security Features */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <Heading as="h2" className="text-3xl">Additional Security Features</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Eye className="h-6 w-6 text-blue-600" />
                      <CardTitle className="text-xl">Access Control</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold">Authentication Required</p>
                          <p className="text-muted-foreground">Must be logged in to access any organisation data</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold">Organisation Membership</p>
                          <p className="text-muted-foreground">Must be a member of an organisation to view its data</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold">Role-Based Permissions</p>
                          <p className="text-muted-foreground">Actions are further restricted by your role within the organisation</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Lock className="h-6 w-6 text-purple-600" />
                      <CardTitle className="text-xl">Data Encryption</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold">HTTPS Encryption</p>
                          <p className="text-muted-foreground">All data in transit is encrypted with TLS/SSL</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold">Database Encryption</p>
                          <p className="text-muted-foreground">Sensitive data is encrypted at rest in the database</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold">Secure File Storage</p>
                          <p className="text-muted-foreground">Uploaded documents are encrypted and stored securely</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-green-600" />
                      <CardTitle className="text-xl">Audit Trail</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold">Activity Logging</p>
                          <p className="text-muted-foreground">All actions are logged with user, timestamp, and organisation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold">Change Tracking</p>
                          <p className="text-muted-foreground">Before and after states are recorded for important changes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold">Compliance Support</p>
                          <p className="text-muted-foreground">Audit logs support compliance and security reviews</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Common Questions */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <Heading as="h2" className="text-3xl">Common Questions</Heading>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Can users from one organisation access another organisation's data?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <strong>No.</strong> Unless you are a member of both organisations, you cannot access data from 
                    an organisation you don't belong to. Even if you belong to multiple organisations, you can only 
                    view one organisation's data at a time (the one you're currently switched to).
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">What if I accidentally try to access another organisation's data?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    The system will automatically block the request. You'll either see an "Access Denied" message or 
                    simply won't see any data. The security is built into every database query, so it's technically 
                    impossible to bypass.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Can Super Admins see all organisation data?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <strong>Yes.</strong> Super Administrators have platform-wide access and can view and manage data 
                    across all organisations. This is necessary for system administration, but Super Admin access is 
                    tightly controlled and logged.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">What happens if someone shares a direct link to a case from another organisation?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Even with a direct URL, you won't be able to access the case if you're not a member of that 
                    organisation. The system checks your organisation membership before showing any data, regardless 
                    of how you arrived at the page.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">How do I know which organisation I'm currently viewing?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    The current organisation name is displayed in the top navigation bar. If you belong to multiple 
                    organisations, you'll see an organisation switcher that shows your current organisation and 
                    allows you to switch between them.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Is my data backed up separately from other organisations?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    All data is backed up together at the platform level, but the organisation-level isolation is 
                    preserved in backups. If a restore is needed, your organisation's data integrity and isolation 
                    are maintained.
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Best Practices */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-teal-600" />
                </div>
                <Heading as="h2" className="text-3xl">Security Best Practices</Heading>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Do This
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Always check which organisation you're in before creating data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Use the organisation switcher when you need to change context</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Log out when finished, especially on shared computers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Report any suspicious access or security concerns immediately</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Verify you're in the right organisation before uploading sensitive documents</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      Don't Do This
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Share login credentials with anyone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Try to access data you're not authorized to view</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Leave your session open on public or shared computers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Assume you're in the right organisation without checking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Share direct links to sensitive data outside your organisation</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Summary */}
            <section className="space-y-6">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-blue-600" />
                    <CardTitle className="text-xl">Security Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">Totolaw's multi-tenant security ensures:</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Complete Data Isolation</strong> - Your data is never mixed with other organisations</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Automatic Protection</strong> - Security is built into every database query</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Multiple Security Layers</strong> - Authentication, authorization, and data filtering</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Full Audit Trail</strong> - All access and changes are logged</span>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground italic">
                      You can confidently use Totolaw knowing that your organisation's data is secure, 
                      private, and protected from unauthorized access.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Related Topics */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-gray-600" />
                </div>
                <Heading as="h2" className="text-3xl">Related Topics</Heading>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <Link href="/docs/rbac">
                    <CardHeader>
                      <Shield className="h-8 w-8 text-purple-600 mb-2" />
                      <CardTitle className="text-base">RBAC</CardTitle>
                      <CardDescription>
                        Learn about roles and permissions
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <Link href="/docs/authentication">
                    <CardHeader>
                      <Key className="h-8 w-8 text-blue-600 mb-2" />
                      <CardTitle className="text-base">Passwordless Login</CardTitle>
                      <CardDescription>
                        How magic link authentication works
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <Link href="/docs/getting-started">
                    <CardHeader>
                      <BookOpen className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle className="text-base">Getting Started</CardTitle>
                      <CardDescription>
                        New to Totolaw? Start here
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              </div>
            </section>

            {/* CTA */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8 text-center space-y-4">
                <Heading as="h2" className="text-2xl md:text-3xl">
                  Your Data is Secure
                </Heading>
                <p className="text-lg opacity-90 max-w-2xl mx-auto">
                  Start using Totolaw with confidence, knowing your organisation's data is protected.
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  asChild
                  className="text-lg px-8"
                >
                  <Link href="/auth/login">
                    Sign In Securely
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/50 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>Made with ❤️ for Pacific Island Court Systems</p>
          <p className="mt-2">© 2025 Totolaw. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
