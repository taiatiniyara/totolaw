/**
 * Query Helper Utilities
 * 
 * Common patterns for database queries with multi-tenant organization filtering.
 * All queries should use these helpers to ensure proper data isolation.
 * 
 * Super admins with organizationId="*" bypass all organization filtering.
 */

import { and, eq, SQL } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

/**
 * Add organization filter to query conditions
 * Super admins (organizationId="*") bypass organization filtering
 * 
 * @example
 * const conditions = withOrgFilter(organizationId, cases, [
 *   eq(cases.status, 'active'),
 *   eq(cases.assignedTo, userId)
 * ]);
 */
export function withOrgFilter<T extends PgTable>(
  organizationId: string,
  table: T,
  additionalConditions?: SQL[]
): SQL | undefined {
  // Super admin bypass: "*" means access to all organizations
  if (organizationId === "*") {
    if (!additionalConditions || additionalConditions.length === 0) {
      return undefined;
    }
    return and(...additionalConditions);
  }

  const orgCondition = eq((table as any).organizationId, organizationId);
  
  if (!additionalConditions || additionalConditions.length === 0) {
    return orgCondition;
  }
  
  return and(orgCondition, ...additionalConditions);
}

/**
 * Create organization-scoped values for insert operations
 * Note: Super admins must specify a valid organizationId for inserts
 * 
 * @example
 * await db.insert(cases).values(
 *   withOrgId(organizationId, {
 *     title: 'New Case',
 *     status: 'pending'
 *   })
 * );
 */
export function withOrgId<T extends Record<string, any>>(
  organizationId: string,
  values: T
): T & { organizationId: string } {
  // Super admins must specify a target organization for inserts
  if (organizationId === "*") {
    throw new Error("Super admins must specify a target organizationId for insert operations");
  }
  
  return {
    ...values,
    organizationId,
  };
}

/**
 * Create organization-scoped values for bulk insert operations
 * 
 * @example
 * await db.insert(evidence).values(
 *   withOrgIds(organizationId, [
 *     { title: 'Evidence 1', type: 'document' },
 *     { title: 'Evidence 2', type: 'photo' }
 *   ])
 * );
 */
export function withOrgIds<T extends Record<string, any>>(
  organizationId: string,
  valuesArray: T[]
): Array<T & { organizationId: string }> {
  return valuesArray.map(values => withOrgId(organizationId, values));
}

/**
 * Validate that a record belongs to the current organization
 * Throws error if validation fails
 * Super admins (organizationId="*") bypass validation
 * 
 * @example
 * const caseRecord = await db.select()...;
 * validateOrgAccess(organizationId, caseRecord, 'Case');
 */
export function validateOrgAccess(
  organizationId: string,
  record: { organizationId?: string } | null | undefined,
  resourceName: string = "Resource"
): void {
  if (!record) {
    throw new Error(`${resourceName} not found`);
  }
  
  // Super admins bypass organization validation
  if (organizationId === "*") {
    return;
  }
  
  if (record.organizationId !== organizationId) {
    throw new Error(`Access denied: ${resourceName} does not belong to your organization`);
  }
}

/**
 * Check if a record belongs to the current organization (non-throwing)
 * Super admins (organizationId="*") always have access
 * 
 * @example
 * const caseRecord = await db.select()...;
 * if (hasOrgAccess(organizationId, caseRecord)) {
 *   // proceed
 * }
 */
export function hasOrgAccess(
  organizationId: string,
  record: { organizationId?: string } | null | undefined
): boolean {
  // Super admins have access to all records
  if (organizationId === "*") {
    return record != null;
  }
  
  return record != null && record.organizationId === organizationId;
}
