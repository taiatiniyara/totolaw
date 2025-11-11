import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/drizzle/connection";
import { user } from "@/lib/drizzle/schema/auth-schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Shield, Mail, User } from "lucide-react";
import { Heading } from "@/components/ui/heading";

export default async function UserStatusPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>Please log in to view your status</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Get full user data
  const userData = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  const userRecord = userData[0];

  return (
    <div className="container mx-auto p-8">
      <Heading as="h1" className="mb-6">User Status</Heading>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-medium">{userRecord?.name || "Not set"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="font-medium">{userRecord?.email}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">User ID</div>
              <div className="text-xs font-mono">{userRecord?.id}</div>
            </div>
          </CardContent>
        </Card>

        {/* Super Admin Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Super Admin Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                Super Admin Status
              </div>
              {userRecord?.isSuperAdmin ? (
                <div className="space-y-3">
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Super Admin Active
                  </Badge>
                  {userRecord.adminAddedBy && (
                    <div className="text-sm">
                      <div className="text-muted-foreground">Granted By</div>
                      <div className="font-medium">{userRecord.adminAddedBy}</div>
                    </div>
                  )}
                  {userRecord.adminAddedAt && (
                    <div className="text-sm">
                      <div className="text-muted-foreground">Granted On</div>
                      <div className="font-medium">
                        {new Date(userRecord.adminAddedAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                  {userRecord.lastLogin && (
                    <div className="text-sm">
                      <div className="text-muted-foreground">Last Login</div>
                      <div className="font-medium">
                        {new Date(userRecord.lastLogin).toLocaleString()}
                      </div>
                    </div>
                  )}
                  {userRecord.adminNotes && (
                    <div className="text-sm">
                      <div className="text-muted-foreground">Notes</div>
                      <div className="font-medium">{userRecord.adminNotes}</div>
                    </div>
                  )}
                </div>
              ) : (
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  <XCircle className="mr-1 h-3 w-3" />
                  Regular User
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Access Summary</CardTitle>
          <CardDescription>What you can access with your current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Regular Dashboard Access</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Organization Management</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Super Admin Dashboard</span>
              {userRecord?.isSuperAdmin ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>System-Wide Access (All Organizations)</span>
              {userRecord?.isSuperAdmin ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Manage Other System Admins</span>
              {userRecord?.isSuperAdmin ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
