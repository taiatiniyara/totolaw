#!/usr/bin/env tsx

import { config } from "dotenv";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

config({ path: ".env.local" });
config();

const email = process.argv[2];
const name = process.argv[3] || "System Administrator";

if (!email) {
  console.error("❌ Error: Email is required");
  console.log("Usage: tsx scripts/reset-database.ts email@example.com");
  process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not defined");

const pool = new Pool({ connectionString: url });

async function dropAllDatabaseObjects() {
  console.log("\n🗑️  Dropping all database objects...");
  const client = await pool.connect();
  try {
    await client.query(`
      DO $$ 
      DECLARE r RECORD;
      BEGIN
        FOR r IN (SELECT proname, oidvectortypes(proargtypes) as argtypes
                  FROM pg_proc INNER JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid)
                  WHERE ns.nspname = 'public' AND prokind = 'f') 
        LOOP
          EXECUTE 'DROP FUNCTION IF EXISTS ' || quote_ident(r.proname) || '(' || r.argtypes || ') CASCADE';
        END LOOP;
        
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
        LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `);
    console.log("✅ Dropped all objects");
  } finally {
    client.release();
  }
}

async function runMigration(filename: string) {
  const migrationPath = path.join(process.cwd(), "migrations", filename);
  if (!fs.existsSync(migrationPath)) throw new Error(`Not found: ${filename}`);
  
  console.log(`\n📄 Running: ${filename}`);
  const migrationSQL = fs.readFileSync(migrationPath, "utf-8");
  const client = await pool.connect();
  
  try {
    await client.query(migrationSQL);
    console.log(`✅ Completed: ${filename}`);
  } finally {
    client.release();
  }
}

async function addSystemAdmin() {
  console.log("\n👤 Adding system admin...");
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO system_admins (id, email, name, is_active, added_at, created_at, updated_at)
       VALUES (gen_random_uuid()::text, $1, $2, true, NOW(), NOW(), NOW())
       ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name, is_active = true, updated_at = NOW()`,
      [email.toLowerCase(), name]
    );
    console.log(`✅ Added: ${email}`);
  } finally {
    client.release();
  }
}

async function verifySetup() {
  console.log("\n🔍 Verifying...\n");
  const client = await pool.connect();
  try {
    const org = await client.query('SELECT COUNT(*) FROM organizations');
    const perm = await client.query('SELECT COUNT(*) FROM permissions');
    const role = await client.query('SELECT COUNT(*) FROM roles');
    const rp = await client.query('SELECT COUNT(*) FROM role_permissions');
    const admin = await client.query('SELECT email, name FROM system_admins');
    
    console.log(`   Organizations: ${org.rows[0].count}`);
    console.log(`   Permissions: ${perm.rows[0].count}`);
    console.log(`   Roles: ${role.rows[0].count}`);
    console.log(`   Role-Permissions: ${rp.rows[0].count}`);
    console.log(`   System Admins: ${admin.rows.length}\n`);
    admin.rows.forEach(a => console.log(`   - ${a.email} (${a.name})`));
  } finally {
    client.release();
  }
}

async function main() {
  console.log("\n⚠️  DATABASE RESET - WARNING: DELETES ALL DATA!");
  console.log(`System Admin: ${email} (${name})\n`);
  
  try {
    await dropAllDatabaseObjects();
    
    console.log("\n📦 Pushing schema...");
    execSync("npx drizzle-kit push --config ./lib/drizzle/config.ts", { stdio: "inherit", env: process.env, cwd: process.cwd() });
    console.log("✅ Schema pushed");
    
    await runMigration("001_initial_schema.sql");
    await addSystemAdmin();
    await verifySetup();
    
    console.log("\n✅ Database reset complete!\n");
    console.log(`Login at /auth/login with: ${email}\n`);
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
