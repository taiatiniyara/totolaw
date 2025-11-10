import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/drizzle/connection";
import { user } from "@/lib/drizzle/schema/auth-schema";
import { systemAdmins } from "@/lib/drizzle/schema/system-admin-schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Shield, Mail, User } from "lucide-react";

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

  // Check system admin status
  const systemAdminData = await db
    .select()
    .from(systemAdmins)
    .where(eq(systemAdmins.email, session.user.email.toLowerCase()))
    .limit(1);

  const userRecord = userData[0];
  const systemAdminRecord = systemAdminData[0];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">User Status</h1>

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
                Database Flag (user.isSuperAdmin)
              </div>
              {userRecord?.isSuperAdmin ? (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  True - Super Admin Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  <XCircle className="mr-1 h-3 w-3" />
                  False - Regular User
                </Badge>
              )}
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">
                System Admin Record
              </div>
              {systemAdminRecord ? (
                <div className="space-y-2">
                  <Badge variant="default" className="bg-purple-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Authorized System Admin
                  </Badge>
                  <div className="text-sm">
                    <div className="text-muted-foreground">Name</div>
                    <div className="font-medium">
                      {systemAdminRecord.name || "Not set"}
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">Status</div>
                    <div>
                      {systemAdminRecord.isActive ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                  {systemAdminRecord.userId ? (
                    <div className="text-sm">
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Linked to User Account
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Pending First Login
                      </Badge>
                    </div>
                  )}
                  {systemAdminRecord.lastLogin && (
                    <div className="text-sm">
                      <div className="text-muted-foreground">Last Login</div>
                      <div className="font-medium">
                        {new Date(systemAdminRecord.lastLogin).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  <XCircle className="mr-1 h-3 w-3" />
                  Not a System Admin
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

      {/* Instructions */}
      {systemAdminRecord && !userRecord?.isSuperAdmin && (
        <Card className="mt-6 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Action Required</CardTitle>
            <CardDescription className="text-yellow-700">
              You are registered as a system admin but not yet elevated
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-yellow-800">
            <p>To activate your super admin privileges:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Log out of your account</li>
              <li>Log back in using the magic link</li>
              <li>Your account will be automatically elevated</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
