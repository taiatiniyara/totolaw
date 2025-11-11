# Organization Management - System Admin

## Overview

System administrators can create and manage organizations through the Super Admin dashboard. This feature allows you to add new court systems, tribunals, and other legal entities to the platform.

## Accessing Organization Management

1. Log in as a system administrator
2. Navigate to **Dashboard → Super Admin** (shield icon in sidebar)
3. Click **"Manage Organizations"** or **"Add Organization"**

## Creating a New Organization

### Navigation
- From Super Admin Dashboard → Click **"Add Organization"** button
- Or navigate to: `/dashboard/system-admin/organizations/new`

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Organization Name** | Full legal name | "Fiji High Court" |
| **Organization Code** | Unique identifier | "FIJI-HIGH-COURT" |
| **Organization Type** | Category of entity | "Court" |

### Optional Fields

| Field | Description |
|-------|-------------|
| **Parent Organization** | If this org is part of a larger entity |
| **Description** | Additional context and jurisdiction info |

### Organization Types

- **Court** - Judicial court systems (High Court, Magistrates Court, etc.)
- **Tribunal** - Specialized tribunals (Employment Tribunal, Land Court, etc.)
- **Commission** - Legal commissions and inquiry bodies
- **Registry** - Court registries and administrative offices
- **Department** - Government legal departments
- **Other** - Other legal entities

### Organization Code Rules

- Must be unique across the system
- Automatically converted to UPPERCASE
- Spaces are replaced with hyphens
- Only letters, numbers, hyphens, and underscores allowed
- Examples: `FIJI-HIGH-COURT`, `SAMOA-MAGISTRATE`, `TONGA-TRIBUNAL`

## Managing Existing Organizations

### Viewing All Organizations
Navigate to: `/dashboard/system-admin/organizations`

### Organization List Features
- View all active and inactive organizations
- See organization details (name, code, type, description)
- Check creation and update dates
- Quick statistics (total, active, inactive counts)

### Editing Organizations

**Edit Organization Details:**
1. Find the organization in the list
2. Click the **"Edit"** button next to the organization
3. Update the desired fields:
   - Organization name
   - Organization type
   - Parent organization
   - Description
4. Click **"Update Organization"**
5. Changes are saved and logged in the audit trail

**What Can Be Edited:**
- ✅ Organization name
- ✅ Organization type
- ✅ Parent organization
- ✅ Description
- ❌ Organization code (cannot be changed after creation)

**Validation Rules:**
- Name and type are required fields
- An organization cannot be its own parent
- All changes are audited

### Activating/Deactivating Organizations

**Deactivate an Organization:**
1. Find the organization in the list
2. Click the power button (⚡) next to the organization
3. Confirm the deactivation
4. Users will no longer be able to access this organization's data

**Reactivate an Organization:**
1. Scroll to the "Inactive Organizations" section
2. Click the power button (⚡) next to the organization
3. Confirm the reactivation
4. Users can now access the organization again

**Important:** Deactivating does NOT delete data - it only prevents access.

## What Happens After Creating an Organization

When you create a new organization, the system automatically:

1. ✅ Creates the organization with unique code
2. ✅ Sets up standard roles:
   - Judge
   - Magistrate
   - Court Clerk
   - Court Administrator
   - Registrar
   - Prosecutor
   - Legal Officer
   - Public User
3. ✅ Assigns standard permissions to each role
4. ✅ Prepares the organization for user management
5. ✅ Logs the creation action in audit trail

## Adding Users to New Organizations

After creating an organization:

1. Navigate to **Users** page
2. Click **"Invite User"**
3. Enter user email and details
4. Select the new organization
5. Assign appropriate roles
6. User receives invitation email

## Organization Hierarchy

Organizations can have parent-child relationships:

- **Parent Organization** - A larger entity (e.g., "Fiji Judiciary")
- **Child Organization** - A sub-entity (e.g., "Fiji High Court - Suva Division")

This allows for:
- Organizational structure representation
- Potential data sharing between related entities (future feature)
- Administrative hierarchy

## Best Practices

### Naming Conventions
- Use official legal names
- Be consistent with naming patterns
- Include location for regional offices

### Organization Codes
- Keep codes short but descriptive
- Use country/region prefix (e.g., `FIJI-`, `SAMOA-`)
- Include organization type (e.g., `-HIGH-COURT`, `-TRIBUNAL`)

### Organization Setup
1. Create the organization
2. Verify standard roles are created
3. Invite organization administrators first
4. Let org admins invite their team members
5. Org admins can manage their own settings

## Troubleshooting

### "Organization code already exists"
- Each code must be unique
- Try adding more specificity: `FIJI-HIGH-COURT-SUVA`

### "Cannot access organization"
- Verify organization is **Active**
- Check user has been added to the organization
- Ensure user has been assigned a role

### Changes not reflecting
- Refresh the page
- Clear browser cache
- Check audit log for errors

## Permissions Required

Only users with **Super Admin** status can:
- Create organizations
- Deactivate organizations
- Reactivate organizations
- View all organizations across the system

## Related Documentation

- [Super Admin Access](./super-admin-access.md) - Understanding omnipotent access
- [Multi-Tenant RBAC](./multi-tenant-rbac.md) - Role-based access control
- [System Admin Team](./system-admin-team.md) - Managing super admins

## API Endpoints

### Create Organization
```typescript
createOrganization({
  name: string,
  code: string,
  type: string,
  description?: string,
  parentId?: string
})
```

### Update Organization
```typescript
updateOrganization(
  organizationId: string,
  data: {
    name?: string,
    type?: string,
    description?: string,
    parentId?: string
  }
)
```

### Update Organization Status
```typescript
updateOrganizationStatus(
  organizationId: string,
  isActive: boolean
)
```

### Get Organization by ID
```typescript
getOrganizationById(
  organizationId: string
)
```

### Get All Organizations
```typescript
getAllOrganizations()
```

## Files Reference

- `/app/dashboard/system-admin/organizations/page.tsx` - Organizations list page
- `/app/dashboard/system-admin/organizations/new/page.tsx` - Create organization page
- `/app/dashboard/system-admin/organizations/new/create-organization-form.tsx` - Create form component
- `/app/dashboard/system-admin/organizations/[id]/edit/page.tsx` - Edit organization page
- `/app/dashboard/system-admin/organizations/[id]/edit/edit-organization-form.tsx` - Edit form component
- `/app/dashboard/system-admin/organizations/organization-status-toggle.tsx` - Status toggle component
- `/app/dashboard/system-admin/actions.ts` - Server actions

## Security Notes

- All actions are logged in the system audit trail
- Only super admins can perform these operations
- Organization data is isolated per tenant
- Deactivation is reversible - no data loss

---

**Need Help?** Contact the development team or refer to the system admin documentation.
