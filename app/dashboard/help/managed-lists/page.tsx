/**
 * Managed Lists Help Page
 * 
 * Dashboard help page for Managed Lists feature
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import {
  List,
  Database,
  Edit,
  Eye,
  EyeOff,
  Plus,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
  BookOpen,
  Shield,
  Building2,
  FileText,
  Scale,
  GripVertical,
} from "lucide-react";

export default function ManagedListsHelpPage() {
  return (
    <div className="flex-1 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 rounded-full">
                <List className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <Heading as="h1" className="text-4xl md:text-5xl">
              Managed Lists Guide
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              System-wide dropdown list management for Super Administrators
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button asChild variant="outline">
                <Link href="/dashboard/help/user-manual/super-admin">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Super Admin Manual
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/help">
                  <Home className="mr-2 h-4 w-4" />
                  Help Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Overview */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <Heading as="h2" className="text-3xl">What Are Managed Lists?</Heading>
            </div>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-base">
                    <strong>Managed Lists</strong> are system-wide dropdown options used throughout Totolaw. 
                    They control the available choices for case types, statuses, hearing action types, 
                    offense types, and more.
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <List className="h-5 w-5 text-purple-600" />
                      Available List Categories
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          <span><strong>Court Levels:</strong> High Court, Magistrates, etc.</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span><strong>Case Types:</strong> Criminal, Civil, Appeal, etc.</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-orange-600" />
                          <span><strong>Case Statuses:</strong> Open, Active, Closed, etc.</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Scale className="h-4 w-4 text-indigo-600" />
                          <span><strong>Action Types:</strong> Mention, Trial, Sentencing, etc.</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span><strong>Offense Types:</strong> Various criminal offenses</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4 text-purple-600" />
                          <span><strong>Bail Decisions:</strong> Granted, Denied, etc.</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span><strong>Sentence Types:</strong> Custodial, Non-custodial, etc.</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <List className="h-4 w-4 text-teal-600" />
                          <span><strong>And more...</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-900 mb-1">Super Admin Only</p>
                        <p className="text-sm text-amber-800">
                          Only Super Administrators can manage system lists. Changes affect all 
                          organisations immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Accessing Managed Lists */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <List className="h-6 w-6 text-blue-600" />
              </div>
              <Heading as="h2" className="text-3xl">Accessing Managed Lists</Heading>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                      1
                    </span>
                    <div>
                      <p className="font-medium">Login as Super Admin</p>
                      <p className="text-xs text-muted-foreground">You must have Super Admin privileges</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                      2
                    </span>
                    <div>
                      <p className="font-medium">Go to System Admin</p>
                      <p className="text-xs text-muted-foreground">
                        Click <strong>System Admin</strong> in the left sidebar
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                      3
                    </span>
                    <div>
                      <p className="font-medium">Click "Manage System Lists"</p>
                      <p className="text-xs text-muted-foreground">
                        From the Quick Actions section or direct link
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                      4
                    </span>
                    <div>
                      <p className="font-medium">Select a List Category</p>
                      <p className="text-xs text-muted-foreground">
                        Click "Manage Items" on any list card
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          {/* Managing List Items */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Edit className="h-6 w-6 text-green-600" />
              </div>
              <Heading as="h2" className="text-3xl">Managing List Items</Heading>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="h-5 w-5 text-green-600" />
                    Adding New Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="font-semibold">1.</span>
                        <div>
                          <p className="font-medium">Click "Add Item" button</p>
                          <p className="text-xs text-muted-foreground">Opens the add item dialog</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold">2.</span>
                        <div>
                          <p className="font-medium">Enter item details:</p>
                          <ul className="text-xs text-muted-foreground ml-4 mt-1 space-y-1">
                            <li>• <strong>Value:</strong> Internal code (e.g., "high_court", "PENDING")</li>
                            <li>• <strong>Label:</strong> Display text (e.g., "High Court", "Pending")</li>
                            <li>• <strong>Description:</strong> Optional context or tooltip text</li>
                            <li>• <strong>Active:</strong> Toggle to show/hide from users</li>
                          </ul>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold">3.</span>
                        <div>
                          <p className="font-medium">Click "Add Item"</p>
                          <p className="text-xs text-muted-foreground">Item is added immediately</p>
                        </div>
                      </li>
                    </ol>

                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <p className="text-xs text-blue-900">
                        <strong>Tip:</strong> Use lowercase with underscores for values (e.g., "bail_hearing") 
                        and proper capitalization for labels (e.g., "Bail Hearing").
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Edit className="h-5 w-5 text-blue-600" />
                    Editing Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Inline Editing</p>
                        <p className="text-xs text-muted-foreground">
                          Click the <Edit className="inline h-3 w-3" /> icon to edit value, label, and description
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Save Changes</p>
                        <p className="text-xs text-muted-foreground">
                          Click the checkmark to save or X to cancel edits
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Bulk Changes</p>
                        <p className="text-xs text-muted-foreground">
                          Make multiple edits, then click "Save Changes" at the top to apply all at once
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-purple-600" />
                    Reordering Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      The order of items determines how they appear in dropdowns throughout the system.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold mb-2">To reorder items:</p>
                      <ul className="space-y-1 ml-4 text-muted-foreground">
                        <li>• Use the <GripVertical className="inline h-3 w-3" /> handle to drag items</li>
                        <li>• Items are automatically renumbered</li>
                        <li>• Click "Save Changes" to apply new order</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <EyeOff className="h-5 w-5 text-orange-600" />
                    Deactivating Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Instead of deleting items, mark them as inactive to preserve data integrity:
                    </p>
                    
                    <ol className="space-y-2 text-sm ml-4">
                      <li>1. Click the <EyeOff className="inline h-3 w-3" /> icon on an active item</li>
                      <li>2. Confirm deactivation</li>
                      <li>3. Item moves to "Inactive Items" section</li>
                    </ol>

                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-900">
                          <strong>Important:</strong> Inactive items are hidden from users but existing 
                          data references are preserved. This prevents breaking historical records.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-600" />
                    Reactivating Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      You can restore previously deactivated items:
                    </p>
                    <ol className="space-y-1 ml-4 text-muted-foreground">
                      <li>1. Scroll to the "Inactive Items" section</li>
                      <li>2. Click "Reactivate" on the item</li>
                      <li>3. Item returns to active status</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Item Fields */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <Heading as="h2" className="text-3xl">Understanding Item Fields</Heading>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">value</code>
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        The internal code/key stored in the database. This is used by the system 
                        internally and should not change once created.
                      </p>
                      <div className="mt-2 p-3 bg-muted rounded-lg text-xs">
                        <p className="font-semibold mb-1">Examples:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• <code>high_court</code> - for High Court</li>
                          <li>• <code>MENTION</code> - for Mention hearing</li>
                          <li>• <code>open</code> - for Open status</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">label</code>
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        The user-friendly display text shown in dropdowns and throughout the UI. 
                        This can be updated anytime.
                      </p>
                      <div className="mt-2 p-3 bg-muted rounded-lg text-xs">
                        <p className="font-semibold mb-1">Examples:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• <code>High Court</code></li>
                          <li>• <code>Mention</code></li>
                          <li>• <code>Open</code></li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">description</code>
                        <Badge variant="outline" className="text-xs">Optional</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Additional context or explanation. May be shown in tooltips or help text.
                      </p>
                      <div className="mt-2 p-3 bg-muted rounded-lg text-xs">
                        <p className="font-semibold mb-1">Example:</p>
                        <p className="ml-4 italic">
                          "Superior court for serious criminal and civil matters"
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">sortOrder</code>
                        <Badge variant="outline" className="text-xs">Auto</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Determines the display order in dropdowns. Lower numbers appear first. 
                        Managed automatically when you drag to reorder items.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">isActive</code>
                        <Badge variant="outline" className="text-xs">Toggle</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Controls visibility to users. Active items appear in dropdowns; inactive 
                        items are hidden but preserve historical data.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Best Practices */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <Heading as="h2" className="text-3xl">Best Practices</Heading>
            </div>

            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Never Change Values</p>
                        <p className="text-xs text-muted-foreground">
                          Once a value is in use, don't change it. This would break existing data references. 
                          Instead, update the label for display changes.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Deactivate, Don't Delete</p>
                        <p className="text-xs text-muted-foreground">
                          Always mark items as inactive instead of trying to delete them. This preserves 
                          data integrity for historical records.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Use Consistent Naming</p>
                        <p className="text-xs text-muted-foreground">
                          For values: lowercase_with_underscores. For labels: Proper Title Case. 
                          This ensures consistency across the system.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Add Descriptions</p>
                        <p className="text-xs text-muted-foreground">
                          Include descriptions for items that may need clarification, especially for 
                          legal or technical terms.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Test Changes</p>
                        <p className="text-xs text-muted-foreground">
                          After adding or modifying items, verify they appear correctly in relevant 
                          dropdowns throughout the system.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Communicate Changes</p>
                        <p className="text-xs text-muted-foreground">
                          When making significant changes to lists, notify organisation administrators 
                          as it affects all users immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Common Use Cases */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <List className="h-6 w-6 text-teal-600" />
              </div>
              <Heading as="h2" className="text-3xl">Common Use Cases</Heading>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Adding New Case Type</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    When your court system needs a new case category:
                  </p>
                  <ol className="space-y-1 ml-4 text-xs">
                    <li>1. Navigate to Case Types list</li>
                    <li>2. Click "Add Item"</li>
                    <li>3. Value: <code>employment_dispute</code></li>
                    <li>4. Label: <code>Employment Dispute</code></li>
                    <li>5. Description: Add context if needed</li>
                    <li>6. Save and verify in case creation forms</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Retiring Old Offense Type</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    When an offense classification is no longer used:
                  </p>
                  <ol className="space-y-1 ml-4 text-xs">
                    <li>1. Navigate to Offense Types list</li>
                    <li>2. Find the outdated offense</li>
                    <li>3. Click the <EyeOff className="inline h-3 w-3" /> deactivate icon</li>
                    <li>4. Confirm deactivation</li>
                    <li>5. Item hidden from users, data preserved</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Reordering Hearing Types</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    To change the order of hearing action types:
                  </p>
                  <ol className="space-y-1 ml-4 text-xs">
                    <li>1. Navigate to Action Types list</li>
                    <li>2. Drag items using <GripVertical className="inline h-3 w-3" /> handle</li>
                    <li>3. Arrange in desired order</li>
                    <li>4. Click "Save Changes"</li>
                    <li>5. New order reflects in all dropdowns</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Updating Label Wording</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    To improve clarity of an existing item:
                  </p>
                  <ol className="space-y-1 ml-4 text-xs">
                    <li>1. Select the relevant list</li>
                    <li>2. Click <Edit className="inline h-3 w-3" /> edit icon on item</li>
                    <li>3. Update label text only (not value)</li>
                    <li>4. Add or update description if needed</li>
                    <li>5. Save changes</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Related Resources */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-pink-600" />
              </div>
              <Heading as="h2" className="text-3xl">Related Resources</Heading>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <Link href="/dashboard/help/user-manual/super-admin" className="block space-y-2 hover:opacity-75 transition-opacity">
                    <Shield className="h-8 w-8 text-purple-600" />
                    <h3 className="font-semibold">Super Admin Manual</h3>
                    <p className="text-xs text-muted-foreground">
                      Complete Super Admin guide
                    </p>
                    <div className="flex items-center text-xs text-blue-600">
                      Read more <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Link href="/dashboard/help/rbac" className="block space-y-2 hover:opacity-75 transition-opacity">
                    <Shield className="h-8 w-8 text-red-600" />
                    <h3 className="font-semibold">RBAC System</h3>
                    <p className="text-xs text-muted-foreground">
                      Roles and permissions overview
                    </p>
                    <div className="flex items-center text-xs text-blue-600">
                      Learn more <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Link href="/dashboard/help" className="block space-y-2 hover:opacity-75 transition-opacity">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <h3 className="font-semibold">Help Home</h3>
                    <p className="text-xs text-muted-foreground">
                      Browse all help topics
                    </p>
                    <div className="flex items-center text-xs text-blue-600">
                      View all <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Support */}
          <section>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <h3 className="font-semibold text-lg">Need Help?</h3>
                  <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                    If you encounter issues managing lists or have questions about specific 
                    list categories, contact the platform development team.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild variant="outline">
                      <Link href="/dashboard/help">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Help Home
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/dashboard">
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
