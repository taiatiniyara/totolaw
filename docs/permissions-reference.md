# Standard Permissions Reference

This document defines the standard permissions for the Totolaw multi-tenant court management system.

## Permission Structure

Permissions follow the format: `resource:action`

- **resource**: The entity being accessed (e.g., cases, hearings, users)
- **action**: The operation being performed (e.g., create, read, update, delete)

## Core Resources & Permissions

### Cases

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `cases:create` | Create new cases | Court Clerk, Prosecutor |
| `cases:read` | View case details | All roles |
| `cases:read-all` | View all cases in organisation | Judge, Administrator |
| `cases:read-own` | View only assigned/created cases | Clerk, Prosecutor, Defender |
| `cases:update` | Edit case information | Court Clerk, Judge |
| `cases:delete` | Delete cases | Administrator only |
| `cases:assign` | Assign cases to judges/staff | Senior Magistrate, Administrator |
| `cases:close` | Close/finalize cases | Judge, Magistrate |
| `cases:reopen` | Reopen closed cases | Judge, Administrator |
| `cases:export` | Export case data | Administrator, Judge |

### Hearings

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `hearings:create` | Schedule hearings | Court Clerk, Judge |
| `hearings:read` | View hearing details | All roles |
| `hearings:update` | Modify hearing schedule | Court Clerk, Judge |
| `hearings:delete` | Cancel hearings | Court Clerk, Judge |
| `hearings:attend` | Mark attendance | Court Clerk |
| `hearings:reschedule` | Reschedule hearings | Judge, Senior Clerk |

### Evidence

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `evidence:submit` | Submit evidence | Prosecutor, Defender, Police |
| `evidence:read` | View evidence | Judge, Prosecutor, Defender |
| `evidence:update` | Edit evidence metadata | Submitter, Court Clerk |
| `evidence:delete` | Remove evidence | Administrator only |
| `evidence:approve` | Approve evidence admission | Judge |
| `evidence:reject` | Reject evidence | Judge |

### Verdicts

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `verdicts:create` | Issue verdicts | Judge, Magistrate |
| `verdicts:read` | View verdicts | All roles |
| `verdicts:update` | Modify verdicts | Judge (within window) |
| `verdicts:appeal` | File appeal against verdict | Defender, Prosecutor |

### Sentences

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `sentences:create` | Issue sentences | Judge |
| `sentences:read` | View sentences | All roles |
| `sentences:update` | Modify sentences | Judge (within window) |
| `sentences:reduce` | Reduce sentence | Judge, Chief Justice |
| `sentences:appeal` | Appeal sentence | Defender |

### Pleas

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `pleas:create` | Record plea | Court Clerk, Judge |
| `pleas:read` | View pleas | Judge, Prosecutor, Defender |
| `pleas:update` | Change plea | Judge |

### Trials

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `trials:create` | Create trial record | Court Clerk |
| `trials:read` | View trial information | All roles |
| `trials:update` | Update trial details | Court Clerk, Judge |
| `trials:preside` | Preside over trial | Judge |

### Appeals

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `appeals:create` | File appeal | Defender, Prosecutor |
| `appeals:read` | View appeals | Judge, Prosecutor, Defender |
| `appeals:update` | Update appeal status | Court Clerk, Judge |
| `appeals:decide` | Rule on appeal | Appellate Judge |

### Enforcement

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `enforcement:create` | Create enforcement action | Police Officer, Bailiff |
| `enforcement:read` | View enforcement records | Judge, Police, Administrator |
| `enforcement:update` | Update enforcement status | Police Officer, Bailiff |
| `enforcement:complete` | Mark enforcement complete | Police Officer |

### Users

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `users:create` | Create user accounts | Administrator |
| `users:read` | View user profiles | Administrator, Senior Clerk |
| `users:read-all` | View all users in org | Administrator |
| `users:update` | Edit user information | Administrator |
| `users:delete` | Delete users | Administrator |
| `users:activate` | Activate user accounts | Administrator |
| `users:deactivate` | Deactivate users | Administrator |
| `users:impersonate` | Login as another user | Super Admin only |

### Roles

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `roles:create` | Create new roles | Administrator |
| `roles:read` | View roles | Administrator |
| `roles:update` | Edit role details | Administrator |
| `roles:delete` | Delete roles | Administrator |
| `roles:assign` | Assign roles to users | Administrator, Senior Clerk |
| `roles:revoke` | Revoke user roles | Administrator |

### Permissions

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `permissions:read` | View permissions | Administrator |
| `permissions:assign` | Assign permissions to roles | Administrator |
| `permissions:revoke` | Remove permissions from roles | Administrator |
| `permissions:grant` | Grant direct permissions to users | Administrator |
| `permissions:deny` | Explicitly deny user permissions | Administrator |

### Organisations

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `organisations:create` | Create sub-organisations | Super Admin, Administrator |
| `organisations:read` | View organisation details | All members |
| `organisations:update` | Edit organisation settings | Administrator |
| `organisations:delete` | Delete organisations | Super Admin only |
| `organisations:invite` | Invite users to organisation | Administrator, Senior Clerk |
| `organisations:remove-member` | Remove org members | Administrator |

### Reports

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `reports:view` | View standard reports | Judge, Administrator |
| `reports:create` | Create custom reports | Administrator |
| `reports:export` | Export report data | Administrator, Judge |
| `reports:schedule` | Schedule automated reports | Administrator |

### Audit Logs

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `audit:view` | View audit logs | Administrator |
| `audit:export` | Export audit data | Administrator |

### Settings

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `settings:read` | View system settings | Administrator |
| `settings:update` | Modify system settings | Administrator |
| `settings:manage-templates` | Manage proceeding templates | Administrator |
| `settings:manage-lists` | Manage managed lists | Administrator, Senior Clerk |

### Documents

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `documents:upload` | Upload documents | Court Clerk, Prosecutor, Defender |
| `documents:read` | View documents | All roles |
| `documents:update` | Edit document metadata | Court Clerk |
| `documents:delete` | Delete documents | Administrator |
| `documents:seal` | Seal confidential documents | Judge, Administrator |

### Notifications

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `notifications:send` | Send notifications | System, Administrator |
| `notifications:read` | View own notifications | All roles |
| `notifications:manage` | Manage notification settings | All roles |

## Standard Role Definitions

### Super Admin

Platform-wide administrator with all permissions.

**Permissions**: ALL

### Chief Justice

Highest authority in an organisation's court system.

**Permissions**:
- All case permissions
- All hearing permissions
- All verdict permissions
- All sentence permissions
- `users:read-all`, `users:update`
- `roles:assign`, `roles:revoke`
- `reports:view`, `reports:export`
- `audit:view`
- `settings:read`

### Judge

Presiding judge with case management authority.

**Permissions**:
- `cases:read-all`, `cases:update`, `cases:assign`, `cases:close`
- `hearings:create`, `hearings:read`, `hearings:update`, `hearings:reschedule`
- `evidence:read`, `evidence:approve`, `evidence:reject`
- `verdicts:create`, `verdicts:update`
- `sentences:create`, `sentences:update`
- `pleas:read`, `pleas:update`
- `trials:read`, `trials:preside`
- `appeals:read`, `appeals:decide`
- `reports:view`, `reports:export`

### Senior Magistrate

Magistrate with administrative duties.

**Permissions**:
- `cases:read-all`, `cases:assign`, `cases:close`
- `hearings:create`, `hearings:read`, `hearings:update`, `hearings:reschedule`
- `evidence:read`
- `verdicts:create`, `verdicts:update`
- `sentences:create`, `sentences:update`
- `pleas:read`, `pleas:update`
- `trials:read`, `trials:preside`
- `users:read`
- `reports:view`

### Magistrate

Lower court judge for minor cases.

**Permissions**:
- `cases:read-own`, `cases:update`, `cases:close`
- `hearings:read`, `hearings:update`
- `evidence:read`, `evidence:approve`
- `verdicts:create`
- `sentences:create`
- `pleas:read`, `pleas:update`
- `trials:read`, `trials:preside`

### Senior Clerk

Administrative clerk with user management.

**Permissions**:
- `cases:read-all`, `cases:create`, `cases:update`
- `hearings:create`, `hearings:read`, `hearings:update`, `hearings:attend`
- `evidence:read`
- `pleas:create`, `pleas:read`
- `trials:create`, `trials:read`, `trials:update`
- `users:read`, `users:create`, `users:update`
- `roles:assign` (limited)
- `organisations:invite`
- `documents:upload`, `documents:read`, `documents:update`
- `settings:manage-lists`

### Court Clerk

Day-to-day case administration.

**Permissions**:
- `cases:create`, `cases:read-own`, `cases:update`
- `hearings:create`, `hearings:read`, `hearings:update`, `hearings:attend`
- `evidence:read`, `evidence:update`
- `pleas:create`, `pleas:read`
- `trials:create`, `trials:read`, `trials:update`
- `documents:upload`, `documents:read`, `documents:update`

### Prosecutor

Government/state prosecutor.

**Permissions**:
- `cases:create`, `cases:read-own`
- `hearings:read`
- `evidence:submit`, `evidence:read`
- `verdicts:read`
- `sentences:read`
- `pleas:read`
- `trials:read`
- `appeals:create`, `appeals:read`
- `documents:upload`, `documents:read`

### Public Defender

Defense attorney.

**Permissions**:
- `cases:read-own`
- `hearings:read`
- `evidence:submit`, `evidence:read`
- `verdicts:read`
- `sentences:read`
- `pleas:read`
- `trials:read`
- `appeals:create`, `appeals:read`
- `documents:upload`, `documents:read`

### Police Officer

Law enforcement with evidence submission.

**Permissions**:
- `cases:read-own`
- `evidence:submit`, `evidence:read`
- `enforcement:create`, `enforcement:read`, `enforcement:update`, `enforcement:complete`
- `documents:upload`, `documents:read`

### Administrator

System and user administrator.

**Permissions**:
- `users:*` (all user permissions)
- `roles:*` (all role permissions)
- `permissions:*` (all permission permissions)
- `organisations:*` (all org permissions except delete)
- `settings:*` (all settings permissions)
- `reports:*` (all report permissions)
- `audit:view`, `audit:export`
- `cases:read-all`, `cases:delete`
- `evidence:delete`
- `documents:delete`

### Viewer

Read-only access for auditors/observers.

**Permissions**:
- `cases:read-all`
- `hearings:read`
- `evidence:read`
- `verdicts:read`
- `sentences:read`
- `pleas:read`
- `trials:read`
- `appeals:read`
- `reports:view`

## Permission Groups

For easier management, permissions can be grouped:

### Case Management Group
- `cases:*`
- `hearings:*`
- `evidence:*`
- `documents:*`

### Judicial Group
- `verdicts:*`
- `sentences:*`
- `trials:*`
- `appeals:*`

### Administration Group
- `users:*`
- `roles:*`
- `permissions:*`
- `organisations:*`
- `settings:*`

### Reporting Group
- `reports:*`
- `audit:*`

## Usage Examples

### Creating a Custom Role

```typescript
// Create a "Case Manager" role with specific permissions
const caseManagerPermissions = [
  'cases:create',
  'cases:read-all',
  'cases:update',
  'cases:assign',
  'hearings:create',
  'hearings:read',
  'hearings:update',
  'documents:upload',
  'documents:read',
];

// Assign to role after creation
```

### Checking Permissions in Code

```typescript
// Check single permission
const canCreateCase = await hasPermission(
  userId, 
  organisationId, 
  'cases:create'
);

// Check multiple permissions (any)
const canManageCases = await hasAnyPermission(
  userId,
  organisationId,
  ['cases:create', 'cases:update', 'cases:assign']
);

// Check multiple permissions (all)
const canFullyManageCases = await hasAllPermissions(
  userId,
  organisationId,
  ['cases:create', 'cases:read', 'cases:update', 'cases:delete']
);
```

## Best Practices

1. **Principle of Least Privilege**: Grant only necessary permissions
2. **Use Roles**: Prefer role-based assignment over direct permissions
3. **Regular Audits**: Review and audit permission assignments regularly
4. **Document Custom Permissions**: Document any custom permissions added
5. **Test Permission Flows**: Test permission checks thoroughly
6. **Monitor Access**: Use audit logs to monitor sensitive permission usage

---

**Last Updated**: November 2025
