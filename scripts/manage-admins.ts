#!/usr/bin/env tsx
/**
 * System Admin CLI Tool
 * Manage super admins from the command line
 * 
 * Usage:
 *   npm run admin:list                           # List all admins
 *   npm run admin:add email@example.com "Name"   # Add new admin
 *   npm run admin:remove email@example.com       # Remove admin
 *   npm run admin:activate email@example.com     # Reactivate admin
 *   npm run admin:audit                          # View audit log
 */

import { db } from "../lib/drizzle/connection";
import {
  systemAdmins,
  systemAdminAuditLog,
} from "../lib/drizzle/schema/system-admin-schema";
import { user } from "../lib/drizzle/schema/auth-schema";
import { eq } from "drizzle-orm";

const command = process.argv[2];
const args = process.argv.slice(3);

async function listAdmins() {
  console.log("\n📋 System Administrators\n");
  
  const admins = await db
    .select({
      admin: systemAdmins,
      user: user,
    })
    .from(systemAdmins)
    .leftJoin(user, eq(systemAdmins.userId, user.id))
    .orderBy(systemAdmins.addedAt);

  if (admins.length === 0) {
    console.log("No system admins found.");
    return;
  }

  admins.forEach((record: any) => {
    const status = record.admin.isActive ? "✅ Active" : "❌ Inactive";
    const linked = record.user ? "🔗 Linked" : "⏳ Pending";
    const lastLogin = record.admin.lastLogin
      ? new Date(record.admin.lastLogin).toLocaleDateString()
      : "Never";

    console.log(`${status} ${linked}`);
    console.log(`  Email: ${record.admin.email}`);
    console.log(`  Name: ${record.admin.name || "Unnamed"}`);
    console.log(`  Last Login: ${lastLogin}`);
    if (record.admin.notes) {
      console.log(`  Notes: ${record.admin.notes}`);
    }
    console.log("");
  });
}

async function addAdmin() {
  const email = args[0];
  const name = args[1];

  if (!email || !name) {
    console.error("❌ Error: Email and name are required");
    console.log("Usage: npm run admin:add email@example.com \"Admin Name\"");
    process.exit(1);
  }

  // Check if already exists
  const existing = await db
    .select()
    .from(systemAdmins)
    .where(eq(systemAdmins.email, email.toLowerCase()))
    .limit(1);

  if (existing.length > 0) {
    console.error(`❌ Error: ${email} is already registered as a system admin`);
    process.exit(1);
  }

  const { generateUUID } = await import("../lib/services/uuid.service");
  const id = generateUUID();

  await db.insert(systemAdmins).values({
    id,
    email: email.toLowerCase(),
    name,
    isActive: true,
  });

  console.log(`\n✅ Successfully added system admin: ${email}`);
  console.log(`   Name: ${name}`);
  console.log(`\n📧 Next steps:`);
  console.log(`   1. Share login link: /auth/login`);
  console.log(`   2. They will be automatically elevated on first login`);
  console.log("");
}

async function removeAdmin() {
  const email = args[0];

  if (!email) {
    console.error("❌ Error: Email is required");
    console.log("Usage: npm run admin:remove email@example.com");
    process.exit(1);
  }

  const admin = await db
    .select()
    .from(systemAdmins)
    .where(eq(systemAdmins.email, email.toLowerCase()))
    .limit(1);

  if (admin.length === 0) {
    console.error(`❌ Error: System admin ${email} not found`);
    process.exit(1);
  }

  // Deactivate admin
  await db
    .update(systemAdmins)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(systemAdmins.id, admin[0].id));

  // Remove super admin flag from user if linked
  if (admin[0].userId) {
    await db
      .update(user)
      .set({ isSuperAdmin: false, updatedAt: new Date() })
      .where(eq(user.id, admin[0].userId));
  }

  console.log(`\n✅ Successfully deactivated system admin: ${email}`);
  console.log(`   They no longer have super admin access`);
  console.log("");
}

async function activateAdmin() {
  const email = args[0];

  if (!email) {
    console.error("❌ Error: Email is required");
    console.log("Usage: npm run admin:activate email@example.com");
    process.exit(1);
  }

  const admin = await db
    .select()
    .from(systemAdmins)
    .where(eq(systemAdmins.email, email.toLowerCase()))
    .limit(1);

  if (admin.length === 0) {
    console.error(`❌ Error: System admin ${email} not found`);
    process.exit(1);
  }

  // Reactivate admin
  await db
    .update(systemAdmins)
    .set({ isActive: true, updatedAt: new Date() })
    .where(eq(systemAdmins.id, admin[0].id));

  // Restore super admin flag to user if linked
  if (admin[0].userId) {
    await db
      .update(user)
      .set({ isSuperAdmin: true, updatedAt: new Date() })
      .where(eq(user.id, admin[0].userId));
  }

  console.log(`\n✅ Successfully reactivated system admin: ${email}`);
  console.log(`   They now have super admin access`);
  console.log("");
}

async function viewAudit() {
  console.log("\n📜 System Admin Audit Log (Last 20 entries)\n");

  const logs = await db
    .select()
    .from(systemAdminAuditLog)
    .orderBy(systemAdminAuditLog.createdAt)
    .limit(20);

  if (logs.length === 0) {
    console.log("No audit log entries found.");
    return;
  }

  logs.reverse().forEach((log: any) => {
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
🛠️  System Admin CLI Tool

Manage super administrators from the command line.

Commands:
  list              List all system admins
  add               Add a new system admin
  remove            Deactivate a system admin
  activate          Reactivate a system admin
  audit             View audit log
  help              Show this help

Usage Examples:
  npm run admin:list
  npm run admin:add admin@example.com "Admin Name"
  npm run admin:remove admin@example.com
  npm run admin:activate admin@example.com
  npm run admin:audit

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
      case "activate":
        await activateAdmin();
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
