#!/bin/bash
# System Admin Setup Verification Script

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "🔍 Verifying System Admin Setup..."
echo ""

# Load environment variables (handle both Unix and Windows line endings)
if [ -f .env ]; then
    export $(grep -v '^#' .env | sed 's/\r$//' | xargs)
else
    echo "❌ Error: .env file not found"
    exit 1
fi

# Check database connection
echo "1. Checking database connection..."
if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
    echo "   ✅ Database connection successful"
else
    echo "   ❌ Database connection failed"
    exit 1
fi

# Check if system_admins table exists
echo ""
echo "2. Checking if system_admins table exists..."
if psql "$DATABASE_URL" -c "\d system_admins" > /dev/null 2>&1; then
    echo "   ✅ system_admins table exists"
else
    echo "   ❌ system_admins table not found"
    echo "   Run: npm run db-push"
    exit 1
fi

# Check if system_admin_audit_log table exists
echo ""
echo "3. Checking if system_admin_audit_log table exists..."
if psql "$DATABASE_URL" -c "\d system_admin_audit_log" > /dev/null 2>&1; then
    echo "   ✅ system_admin_audit_log table exists"
else
    echo "   ❌ system_admin_audit_log table not found"
    echo "   Run: npm run db-push"
    exit 1
fi

# Count system admins
echo ""
echo "4. Checking system admins..."
ADMIN_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM system_admins WHERE is_active = true" 2>/dev/null | tr -d ' ')
if [ -n "$ADMIN_COUNT" ] && [ "$ADMIN_COUNT" -gt 0 ]; then
    echo "   ✅ Found $ADMIN_COUNT active system admin(s)"
    
    # List them
    echo ""
    echo "   Active System Admins:"
    psql "$DATABASE_URL" -c "SELECT email, name, CASE WHEN user_id IS NOT NULL THEN 'Linked' ELSE 'Pending' END as status FROM system_admins WHERE is_active = true ORDER BY added_at" 2>/dev/null | grep -v "^(" | grep -v "^$"
else
    echo "   ⚠️  No active system admins found"
    echo "   Run: psql \$DATABASE_URL -f migrations/003_setup_system_admins.sql"
fi

# Check helper functions
echo ""
echo "5. Checking SQL helper functions..."
FUNC_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM pg_proc WHERE proname IN ('add_system_admin', 'remove_system_admin', 'reactivate_system_admin', 'list_system_admins')" 2>/dev/null | tr -d ' ')
if [ "$FUNC_COUNT" = "4" ]; then
    echo "   ✅ All helper functions exist"
else
    echo "   ⚠️  Helper functions missing (found $FUNC_COUNT/4)"
    echo "   Run: psql \$DATABASE_URL -f migrations/003_setup_system_admins.sql"
fi

# Test CLI tool
echo ""
echo "6. Testing CLI tool..."
if npm run admin:list > /dev/null 2>&1; then
    echo "   ✅ CLI tool works"
else
    echo "   ❌ CLI tool failed"
    exit 1
fi

echo ""
echo "✅ System Admin setup verification complete!"
echo ""
echo "📚 Next steps:"
echo "   - Add more admins: npm run admin:add email@example.com \"Name\""
echo "   - List admins: npm run admin:list"
echo "   - View audit log: npm run admin:audit"
echo "   - Read docs: docs/super-admin-quickstart.md"
echo ""
