#!/bin/bash

# System Admin Setup Script
# This script sets up the system admin infrastructure

echo "🚀 Setting up System Admin Infrastructure..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo "Please set it in your .env file or export it:"
  echo "  export DATABASE_URL='your-database-url'"
  exit 1
fi

echo "📊 Checking database connection..."
if ! psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
  echo "❌ ERROR: Cannot connect to database"
  echo "Please check your DATABASE_URL"
  exit 1
fi

echo "✅ Database connection successful"
echo ""

# Option 1: Use Drizzle Kit to push schema (recommended)
echo "Option 1: Using Drizzle Kit (Recommended)"
echo "Running: npm run db-push"
echo ""
npm run db-push

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Schema pushed successfully!"
  echo ""
  echo "📝 Now add your system admins:"
  echo "   Method 1 (CLI): npm run admin:add admin@example.com \"Admin Name\""
  echo "   Method 2 (SQL): psql \$DATABASE_URL -c \"SELECT add_system_admin('admin@example.com', 'Admin Name', 'Notes')\""
  echo ""
  echo "📋 To list admins: npm run admin:list"
  echo ""
  echo "🌐 Super admin dashboard will be available at: /dashboard/system-admin"
else
  echo ""
  echo "⚠️  Drizzle push failed. Trying manual migration..."
  echo ""
  
  # Option 2: Use manual SQL migration
  echo "Option 2: Running manual SQL migration"
  echo "File: migrations/003_quick_system_admin_setup.sql"
  echo ""
  
  if psql "$DATABASE_URL" -f migrations/003_quick_system_admin_setup.sql; then
    echo ""
    echo "✅ Manual migration successful!"
    echo ""
    echo "📝 To add more admins:"
    echo "   npm run admin:add admin@example.com \"Admin Name\""
    echo ""
    echo "📋 To list admins: npm run admin:list"
  else
    echo ""
    echo "❌ Migration failed!"
    echo "Please check the error messages above"
    exit 1
  fi
fi

echo ""
echo "✨ Setup complete! Your super admin team can now log in."
