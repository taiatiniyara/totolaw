#!/usr/bin/env tsx

// Load environment variables FIRST
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });

import * as readline from 'readline';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { user } from '../lib/drizzle/schema/auth-schema';
import { generateUUID } from '@/lib/services/uuid.service';

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error('\n❌ Error: DATABASE_URL is not defined in .env.local');
  console.error('Please create a .env.local file with your database connection string.\n');
  process.exit(1);
}

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function setupInitialAdmin() {
  console.log('\n🛡️  Initial System Administrator Setup\n');
  console.log('This will create the first super admin for your Totolaw instance.\n');

  try {
    // Get email
    const email = await question('Enter admin email address: ');
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address');
      rl.close();
      await pool.end();
      process.exit(1);
    }

    // Get name
    const name = await question('Enter admin full name: ');
    if (!name || name.trim().length < 2) {
      console.error('❌ Invalid name');
      rl.close();
      await pool.end();
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase().trim()));

    if (existingUser.length > 0) {
      // Update existing user to super admin
      await db
        .update(user)
        .set({
          isSuperAdmin: true,
          adminNotes: 'Initial system administrator',
          adminAddedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(user.email, email.toLowerCase().trim()));

      console.log('\n✅ Existing user updated to super admin!');
      console.log(`📧 Email: ${email}`);
      console.log(`👤 Name: ${existingUser[0].name}`);
    } else {
      // Create new user with super admin privileges
      const userId = generateUUID();
      
      await db.insert(user).values({
        id: userId,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        emailVerified: true,
        isSuperAdmin: true,
        adminNotes: 'Initial system administrator',
        adminAddedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('\n✅ Super admin created successfully!');
      console.log(`📧 Email: ${email}`);
      console.log(`👤 Name: ${name}`);
    }

    console.log('\n📝 Next steps:');
    console.log('1. The admin can now log in at /auth/login');
    console.log('2. They will receive a magic link at their email address');
    console.log('3. After login, they will have full system access');
    console.log('\n🌴 Pacific Island Court Systems - Totolaw\n');

  } catch (error) {
    console.error('\n❌ Error setting up admin:', error);
    await pool.end();
    process.exit(1);
  } finally {
    rl.close();
    await pool.end();
    process.exit(0);
  }
}

setupInitialAdmin();
