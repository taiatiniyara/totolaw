#!/usr/bin/env tsx
/**
 * Super Admin CLI Tool
 * Manage super admin users from the command line
 * 
 * Usage:
 *   npm run admin:list                           # List all admins
 *   npm run admin:add email@example.com "Name"   # Add/grant super admin
 *   npm run admin:remove email@example.com       # Revoke super admin
 *   npm run admin:audit                          # View audit log
 */

import { db } from "../lib/drizzle/connection";
import { user } from "../lib/drizzle/schema/auth-schema";
import { systemAdminAuditLog } from "../lib/drizzle/schema/system-admin-schema";
import { eq } from "drizzle-orm";
import { 
  listSuperAdmins, 
  grantSuperAdminByEmail, 
  revokeSuperAdmin,
  getSuperAdminByEmail,
  getSystemAdminAuditLog
} from "../lib/services/system-admin.service";

const command = process.argv[2];
const args = process.argv.slice(3);

async function listAdmins() {
  console.log("\n📋 Super Administrators\n");
  
  const admins = await listSuperAdmins();

  if (admins.length === 0) {
    console.log("No super admins found.");
    return;
  }

  admins.forEach((admin) => {
    const lastLogin = admin.lastLogin
      ? new Date(admin.lastLogin).toLocaleDateString()
      : "Never";
    const addedAt = admin.adminAddedAt
      ? new Date(admin.adminAddedAt).toLocaleDateString()
      : "Unknown";

    console.log(`✅ ${admin.email}`);
    console.log(`  Name: ${admin.name}`);
    console.log(`  Added: ${addedAt}`);
    console.log(`  Last Login: ${lastLogin}`);
    if (admin.adminNotes) {
      console.log(`  Notes: ${admin.adminNotes}`);
    }
    console.log("");
  });
}

async function addAdmin() {
  const email = args[0];
  const name = args[1];
  const notes = args[2];

  if (!email || !name) {
    console.error("❌ Error: Email and name are required");
    console.log('Usage: npm run admin:add email@example.com "Admin Name" "Optional notes"');
    process.exit(1);
  }

  // Check if already a super admin
  const existing = await getSuperAdminByEmail(email);
  if (existing) {
    console.error(`❌ Error: ${email} is already a super admin`);
    process.exit(1);
  }

  // Get current user for audit (use system if run from CLI)
  const systemUserId = "system";
  
  const userId = await grantSuperAdminByEmail(email, name, systemUserId, notes);

  console.log(`\n✅ Successfully granted super admin privileges to: ${email}`);
  console.log(`   Name: ${name}`);
  console.log(`   User ID: ${userId}`);
  console.log(`\n📧 Next steps:`);
  console.log(`   1. Share login link: /auth/login`);
  console.log(`   2. They can now access the system admin dashboard`);
  console.log("");
}

async function removeAdmin() {
  const email = args[0];
  const reason = args[1];

  if (!email) {
    console.error("❌ Error: Email is required");
    console.log('Usage: npm run admin:remove email@example.com "Optional reason"');
    process.exit(1);
  }

  const admin = await getSuperAdminByEmail(email);
  if (!admin) {
    console.error(`❌ Error: Super admin ${email} not found`);
    process.exit(1);
  }

  // Get current user for audit (use system if run from CLI)
  const systemUserId = "system";
  
  await revokeSuperAdmin(admin.id, systemUserId, reason);

  console.log(`\n✅ Successfully revoked super admin privileges from: ${email}`);
  console.log(`   They no longer have super admin access`);
  if (reason) {
    console.log(`   Reason: ${reason}`);
  }
  console.log("");
}

async function viewAudit() {
  console.log("\n📜 System Admin Audit Log (Last 20 entries)\n");

  const logs = await getSystemAdminAuditLog(20, 0);

  if (logs.length === 0) {
    console.log("No audit log entries found.");
    return;
  }

  logs.reverse().forEach((log) => {
    const date = new Date(log.createdAt).toLocaleString();
    console.log(`[${date}] ${log.action}`);
    console.log(`  ${log.description}`);
    if (log.entityType && log.entityId) {
      console.log(`  Entity: ${log.entityType} (${log.entityId})`);
    }
    if (log.ipAddress) {
      console.log(`  IP: ${log.ipAddress}`);
    }
    console.log("");
  });
}

async function showHelp() {
  console.log(`
🛠️  Super Admin CLI Tool

Manage super administrators from the command line.

Commands:
  list              List all super admins
  add               Grant super admin privileges to a user
  remove            Revoke super admin privileges from a user
  audit             View audit log
  help              Show this help

Usage Examples:
  npm run admin:list
  npm run admin:add admin@example.com "Admin Name" "Optional notes"
  npm run admin:remove admin@example.com "Optional reason"
  npm run admin:audit

Note: Super admin status is now managed directly in the user table.
      Use add/remove commands to grant or revoke privileges.

For more information, see: docs/system-admin-team.md
`);
}

async function main() {
  try {
    switch (command) {
      case "list":
        await listAdmins();
        break;
      case "add":
        await addAdmin();
        break;
      case "remove":
        await removeAdmin();
        break;
      case "audit":
        await viewAudit();
        break;
      case "help":
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
