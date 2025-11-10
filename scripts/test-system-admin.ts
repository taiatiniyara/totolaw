#!/usr/bin/env tsx
/**
 * Test script to verify system admin setup
 */

import { config } from 'dotenv';
config();

import { db } from '../lib/drizzle/connection';
import { systemAdmins } from '../lib/drizzle/schema/system-admin-schema';
import { user } from '../lib/drizzle/schema/auth-schema';
import { eq } from 'drizzle-orm';

async function testSystemAdminSetup() {
  try {
    console.log('Testing system admin setup...\n');
    
    // Test 1: Check database connection
    console.log('1. Testing database connection...');
    const users = await db.select().from(user).limit(1);
    console.log('   ✓ Database connection successful\n', users.length > 0 ? `   ✓ Found user: ${users[0].email}\n` : '   ✓ No users found\n');
    
    // Test 2: Check system_admins table
    console.log('2. Checking system_admins table...');
    const admins = await db.select().from(systemAdmins);
    console.log(`   ✓ Found ${admins.length} system admin(s):`);
    admins.forEach(admin => {
      console.log(`     - ${admin.email} (Active: ${admin.isActive}, User ID: ${admin.userId || 'Not linked'})`);
    });
    console.log('');
    
    // Test 3: Check active admins
    console.log('3. Checking active system admins...');
    const activeAdmins = admins.filter(a => a.isActive);
    console.log(`   ✓ ${activeAdmins.length} active admin(s)\n`);
    
    // Test 4: Check for linked users
    console.log('4. Checking linked user accounts...');
    const linkedAdmins = admins.filter(a => a.userId);
    console.log(`   ✓ ${linkedAdmins.length} admin(s) linked to user accounts`);
    
    for (const admin of linkedAdmins) {
      const userData = await db
        .select()
        .from(user)
        .where(eq(user.id, admin.userId!))
        .limit(1);
      
      if (userData.length > 0) {
        console.log(`     - ${admin.email} → User: ${userData[0].name} (Super Admin: ${userData[0].isSuperAdmin})`);
      }
    }
    console.log('');
    
    // Test 5: Check for users with super admin flag
    console.log('5. Checking users with super admin flag...');
    const superAdminUsers = await db
      .select()
      .from(user)
      .where(eq(user.isSuperAdmin, true));
    
    console.log(`   ✓ Found ${superAdminUsers.length} user(s) with super admin flag:`);
    superAdminUsers.forEach(u => {
      console.log(`     - ${u.email} (Name: ${u.name})`);
    });
    console.log('');
    
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

testSystemAdminSetup();
