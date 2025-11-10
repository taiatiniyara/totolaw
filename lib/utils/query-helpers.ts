/**
 * Query Helper Utilities
 * 
 * Common patterns for database queries with multi-tenant organization filtering.
 * All queries should use these helpers to ensure proper data isolation.
 */

import { and, eq, SQL } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

/**
 * Add organization filter to query conditions
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
  const orgCondition = eq((table as any).organizationId, organizationId);
  
  if (!additionalConditions || additionalConditions.length === 0) {
    return orgCondition;
  }
  
  return and(orgCondition, ...additionalConditions);
}

/**
 * Create organization-scoped values for insert operations
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
  
  if (record.organizationId !== organizationId) {
    throw new Error(`Access denied: ${resourceName} does not belong to your organization`);
  }
}

/**
 * Check if a record belongs to the current organization (non-throwing)
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
  return record != null && record.organizationId === organizationId;
}
