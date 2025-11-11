# Organisation Management - System Admin

## Overview

System administrators can create and manage organisations through the Super Admin dashboard. This feature allows you to add new court systems, tribunals, and other legal entities to the platform.

## Accessing Organisation Management

1. Log in as a system administrator
2. Navigate to **Dashboard → Super Admin** (shield icon in sidebar)
3. Click **"Manage Organisations"** or **"Add Organisation"**

## Creating a New Organisation

### Navigation
- From Super Admin Dashboard → Click **"Add Organisation"** button
- Or navigate to: `/dashboard/system-admin/organisations/new`

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Organisation Name** | Full legal name | "Fiji High Court" |
| **Organisation Code** | Unique identifier | "FIJI-HIGH-COURT" |
| **Organisation Type** | Category of entity | "Court" |

### Optional Fields

| Field | Description |
|-------|-------------|
| **Parent Organisation** | If this org is part of a larger entity |
| **Description** | Additional context and jurisdiction info |

### Organisation Types

- **Court** - Judicial court systems (High Court, Magistrates Court, etc.)
- **Tribunal** - Specialized tribunals (Employment Tribunal, Land Court, etc.)
- **Commission** - Legal commissions and inquiry bodies
- **Registry** - Court registries and administrative offices
- **Department** - Government legal departments
- **Other** - Other legal entities

### Organisation Code Rules

- Must be unique across the system
- Automatically converted to UPPERCASE
- Spaces are replaced with hyphens
- Only letters, numbers, hyphens, and underscores allowed
- Examples: `FIJI-HIGH-COURT`, `SAMOA-MAGISTRATE`, `TONGA-TRIBUNAL`

## Managing Existing Organisations

### Viewing All Organisations
Navigate to: `/dashboard/system-admin/organisations`

### Organisation List Features
- View all active and inactive organisations
- See organisation details (name, code, type, description)
- Check creation and update dates
- Quick statistics (total, active, inactive counts)

### Editing Organisations

**Edit Organisation Details:**
1. Find the organisation in the list
2. Click the **"Edit"** button next to the organisation
3. Update the desired fields:
   - Organisation name
   - Organisation type
   - Parent organisation
   - Description
4. Click **"Update Organisation"**
5. Changes are saved and logged in the audit trail

**What Can Be Edited:**
- ✅ Organisation name
- ✅ Organisation type
- ✅ Parent organisation
- ✅ Description
- ❌ Organisation code (cannot be changed after creation)

**Validation Rules:**
- Name and type are required fields
- An organisation cannot be its own parent
- All changes are audited

### Activating/Deactivating Organisations

**Deactivate an Organisation:**
1. Find the organisation in the list
2. Click the power button (⚡) next to the organisation
3. Confirm the deactivation
4. Users will no longer be able to access this organisation's data

**Reactivate an Organisation:**
1. Scroll to the "Inactive Organisations" section
2. Click the power button (⚡) next to the organisation
3. Confirm the reactivation
4. Users can now access the organisation again

**Important:** Deactivating does NOT delete data - it only prevents access.

## What Happens After Creating an Organisation

When you create a new organisation, the system automatically:

1. ✅ Creates the organisation with unique code
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
4. ✅ Prepares the organisation for user management
5. ✅ Logs the creation action in audit trail

## Adding Users to New Organisations

After creating an organisation:

1. Navigate to **Users** page
2. Click **"Invite User"**
3. Enter user email and details
4. Select the new organisation
5. Assign appropriate roles
6. User receives invitation email

## Organisation Hierarchy

Organisations can have parent-child relationships:

- **Parent Organisation** - A larger entity (e.g., "Fiji Judiciary")
- **Child Organisation** - A sub-entity (e.g., "Fiji High Court - Suva Division")

This allows for:
- Organisational structure representation
- Potential data sharing between related entities (future feature)
- Administrative hierarchy

## Best Practices

### Naming Conventions
- Use official legal names
- Be consistent with naming patterns
- Include location for regional offices

### Organisation Codes
- Keep codes short but descriptive
- Use country/region prefix (e.g., `FIJI-`, `SAMOA-`)
- Include organisation type (e.g., `-HIGH-COURT`, `-TRIBUNAL`)

### Organisation Setup
1. Create the organisation
2. Verify standard roles are created
3. Invite organisation administrators first
4. Let org admins invite their team members
5. Org admins can manage their own settings

## Troubleshooting

### "Organisation code already exists"
- Each code must be unique
- Try adding more specificity: `FIJI-HIGH-COURT-SUVA`

### "Cannot access organisation"
- Verify organisation is **Active**
- Check user has been added to the organisation
- Ensure user has been assigned a role

### Changes not reflecting
- Refresh the page
- Clear browser cache
- Check audit log for errors

## Permissions Required

Only users with **Super Admin** status can:
- Create organisations
- Deactivate organisations
- Reactivate organisations
- View all organisations across the system

## Related Documentation

- [Super Admin Access](./super-admin-access.md) - Understanding omnipotent access
- [Multi-Tenant RBAC](./multi-tenant-rbac.md) - Role-based access control
- [System Admin Team](./system-admin-team.md) - Managing super admins

## API Endpoints

### Create Organisation
```typescript
createOrganisation({
  name: string,
  code: string,
  type: string,
  description?: string,
  parentId?: string
})
```

### Update Organisation
```typescript
updateOrganisation(
  organisationId: string,
  data: {
    name?: string,
    type?: string,
    description?: string,
    parentId?: string
  }
)
```

### Update Organisation Status
```typescript
updateOrganisationStatus(
  organisationId: string,
  isActive: boolean
)
```

### Get Organisation by ID
```typescript
getOrganisationById(
  organisationId: string
)
```

### Get All Organisations
```typescript
getAllOrganisations()
```

## Files Reference

- `/app/dashboard/system-admin/organisations/page.tsx` - Organisations list page
- `/app/dashboard/system-admin/organisations/new/page.tsx` - Create organisation page
- `/app/dashboard/system-admin/organisations/new/create-organisation-form.tsx` - Create form component
- `/app/dashboard/system-admin/organisations/[id]/edit/page.tsx` - Edit organisation page
- `/app/dashboard/system-admin/organisations/[id]/edit/edit-organisation-form.tsx` - Edit form component
- `/app/dashboard/system-admin/organisations/organisation-status-toggle.tsx` - Status toggle component
- `/app/dashboard/system-admin/actions.ts` - Server actions

## Security Notes

- All actions are logged in the system audit trail
- Only super admins can perform these operations
- Organisation data is isolated per tenant
- Deactivation is reversible - no data loss

---

**Need Help?** Contact the development team or refer to the system admin documentation.
