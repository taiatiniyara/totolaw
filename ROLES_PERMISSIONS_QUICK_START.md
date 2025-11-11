# Roles and Permissions UI - Quick Start Guide

## Navigation Structure

```
Dashboard
└── Settings
    ├── Roles & Permissions (/dashboard/settings/roles)
    │   ├── View all roles (System & Custom)
    │   ├── Create new role
    │   ├── Edit role
    │   ├── Delete role
    │   └── View role permissions
    │
    └── Permissions Reference (/dashboard/settings/permissions)
        ├── Browse by resource
        ├── Browse by action
        ├── Search permissions
        └── View format guide

Dashboard
└── Users (/dashboard/users)
    └── User Detail (/dashboard/users/[id])
        └── Manage Roles (dialog)
            ├── View current roles
            ├── Assign new roles
            └── Revoke roles
```

## Quick Actions

### For Administrators

**Create a Custom Role:**
```
Settings → Roles & Permissions → Create Role
→ Enter name, description
→ Select permissions
→ Save
```

**Assign Role to User:**
```
Users → Select User → Manage Roles
→ Select roles from list
→ Assign X Role(s)
```

**Find a Permission:**
```
Settings → Permissions Reference
→ Use search or browse by resource/action
```

### Permission Matrix

| Action | Required Permission | What It Enables |
|--------|-------------------|-----------------|
| View roles | (any authenticated user) | See organization roles |
| Create role | `roles:create` | Create custom roles |
| Edit role | `roles:update` | Modify custom roles |
| Delete role | `roles:delete` | Remove unused roles |
| Assign role to user | `roles:assign` | Grant roles to users |
| Revoke role from user | `roles:revoke` | Remove roles from users |
| View users | `users:read` | See organization members |

## Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Settings Page                         │
│  ┌──────────────────┐    ┌────────────────────────┐    │
│  │ Roles Card       │    │ Permissions Card       │    │
│  │ (Links to /roles)│    │ (Links to /permissions)│    │
│  └──────────────────┘    └────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                     │                    │
        ┌────────────┘                    └────────────┐
        ▼                                              ▼
┌──────────────────────┐              ┌─────────────────────────┐
│   Roles Page         │              │  Permissions Page       │
│  ┌────────────────┐  │              │  ┌───────────────────┐ │
│  │ System Roles   │  │              │  │ Search Bar        │ │
│  │  - Judge       │  │              │  ├───────────────────┤ │
│  │  - Clerk       │  │              │  │ By Resource       │ │
│  │  - ...         │  │              │  │  - cases:*        │ │
│  ├────────────────┤  │              │  │  - users:*        │ │
│  │ Custom Roles   │  │              │  │  - ...            │ │
│  │  [+ Create]    │  │              │  ├───────────────────┤ │
│  │  - Role 1      │  │              │  │ By Action         │ │
│  │  - Role 2      │  │              │  │  - create         │ │
│  └────────────────┘  │              │  │  - read           │ │
└──────────────────────┘              │  │  - update         │ │
         │                             │  │  - delete         │ │
         └──────┐                      │  └───────────────────┘ │
                ▼                      └─────────────────────────┘
       ┌────────────────┐
       │ Role Card      │
       │ ┌────────────┐ │
       │ │ View       │ │──► Shows permissions grouped by resource
       │ │ Edit       │ │──► Opens edit dialog
       │ │ Delete     │ │──► Confirms & deletes
       │ └────────────┘ │
       └────────────────┘

┌──────────────────────────────────────────────────────────┐
│              User Detail Page                            │
│  ┌─────────────────────────────────────────────────┐    │
│  │  [Manage Roles]  ←── Opens ManageUserRolesDialog│    │
│  └─────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────┐               │
│  │ Current Roles                         │               │
│  │  - Judge          [X Revoke]         │               │
│  │  - Viewer         [X Revoke]         │               │
│  ├──────────────────────────────────────┤               │
│  │ Detailed Role Info                   │               │
│  │  - Permissions                       │               │
│  │  - Assignment dates                  │               │
│  │  - Expiration dates                  │               │
│  └──────────────────────────────────────┘               │
└──────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action (UI)
    ↓
Server Action (actions.ts)
    ↓
Authorization Check (authorization.service.ts)
    ↓
Tenant Context (tenant.service.ts)
    ↓
Database Operation (Drizzle ORM)
    ↓
Success/Error Response
    ↓
UI Update (router.refresh() + toast)
```

## Color Coding System

Permissions are color-coded by action type:

- 🟢 **create** - Green (adding new data)
- 🔵 **read**, **read-all**, **read-own** - Blue (viewing data)
- 🟡 **update** - Yellow (modifying data)
- 🔴 **delete** - Red (removing data)
- 🟣 **assign** - Purple (granting access)
- 🟠 **revoke** - Orange (removing access)
- 🟣 **manage** - Indigo (administrative control)

## File Structure

```
/root/totolaw/
├── app/
│   └── dashboard/
│       ├── settings/
│       │   ├── actions.ts              ← Server actions
│       │   ├── page.tsx                ← Settings home (updated)
│       │   ├── roles/
│       │   │   ├── page.tsx            ← Roles list
│       │   │   ├── role-card.tsx       ← Role display
│       │   │   ├── create-role-dialog.tsx
│       │   │   └── edit-role-dialog.tsx
│       │   └── permissions/
│       │       ├── page.tsx            ← Permissions reference
│       │       └── permissions-search.tsx
│       └── users/
│           └── [id]/
│               └── page.tsx            ← User detail (updated)
├── components/
│   └── auth/
│       └── manage-user-roles-dialog.tsx ← Role assignment
├── lib/
│   └── services/
│       ├── authorization.service.ts    ← Permission checks
│       └── tenant.service.ts           ← Organization context
└── docs/
    ├── multi-tenant-rbac.md           ← Architecture docs
    └── permissions-reference.md        ← Permission definitions
```

## Common Workflows

### 1. Setting Up a New Court System

```
1. Create Organization (Super Admin)
2. Create Custom Roles:
   - Senior Court Clerk
   - Case Manager
   - Evidence Coordinator
3. Invite Users
4. Assign Roles to Users
```

### 2. Onboarding a New Employee

```
1. Invite User (email)
2. User Accepts Invitation
3. Navigate to Users → Select User
4. Click "Manage Roles"
5. Assign appropriate role(s)
6. User now has permissions from assigned roles
```

### 3. Modifying Access

```
Option A: Change Role Permissions
  - Edit role → Update permissions → All users with that role affected

Option B: Change User's Roles
  - User detail → Manage Roles → Assign/Revoke roles
```

## Best Practices

✅ **DO:**
- Use descriptive role names (e.g., "Senior Evidence Clerk")
- Group related permissions when creating roles
- Review role assignments regularly
- Document custom roles in descriptions
- Test permission changes with a test user

❌ **DON'T:**
- Modify system roles
- Delete roles that are still assigned to users
- Grant more permissions than needed
- Create duplicate roles with different names
- Assign roles without verification

## Troubleshooting

**Can't see "Create Role" button?**
→ You need the `roles:create` permission

**Can't assign roles to users?**
→ You need the `roles:assign` permission

**Role won't delete?**
→ Check if it's a system role or assigned to users

**Changes not reflecting?**
→ Refresh the page or log out/in

**Permission denied errors?**
→ Contact your organization administrator

## Support

For additional help, refer to:
- `/docs/multi-tenant-rbac.md` - Complete RBAC architecture
- `/docs/permissions-reference.md` - All available permissions
- `ROLES_PERMISSIONS_UI.md` - Detailed implementation docs

---

**Ready to manage your court system efficiently!** ⚖️
