/**
 * Query Helper Utilities
 * 
 * Common patterns for database queries with multi-tenant organisation filtering.
 * All queries should use these helpers to ensure proper data isolation.
 * 
 * Super admins with organisationId="*" bypass all organisation filtering.
 */

import { and, eq, SQL } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

/**
 * Add organisation filter to query conditions
 * Super admins (organisationId="*") bypass organisation filtering
 * 
 * @example
 * const conditions = withOrgFilter(organisationId, cases, [
 *   eq(cases.status, 'active'),
 *   eq(cases.assignedTo, userId)
 * ]);
 */
export function withOrgFilter<T extends PgTable>(
  organisationId: string,
  table: T,
  additionalConditions?: SQL[]
): SQL | undefined {
  // Super admin bypass: "*" means access to all organisations
  if (organisationId === "*") {
    if (!additionalConditions || additionalConditions.length === 0) {
      return undefined;
    }
    return and(...additionalConditions);
  }

  const orgCondition = eq((table as any).organisationId, organisationId);
  
  if (!additionalConditions || additionalConditions.length === 0) {
    return orgCondition;
  }
  
  return and(orgCondition, ...additionalConditions);
}

/**
 * Create organisation-scoped values for insert operations
 * Note: Super admins must specify a valid organisationId for inserts
 * 
 * @example
 * await db.insert(cases).values(
 *   withOrgId(organisationId, {
 *     title: 'New Case',
 *     status: 'pending'
 *   })
 * );
 */
export function withOrgId<T extends Record<string, any>>(
  organisationId: string,
  values: T
): T & { organisationId: string } {
  // Super admins must specify a target organisation for inserts
  if (organisationId === "*") {
    throw new Error("Super admins must specify a target organisationId for insert operations");
  }
  
  return {
    ...values,
    organisationId,
  };
}

/**
 * Create organisation-scoped values for bulk insert operations
 * 
 * @example
 * await db.insert(evidence).values(
 *   withOrgIds(organisationId, [
 *     { title: 'Evidence 1', type: 'document' },
 *     { title: 'Evidence 2', type: 'photo' }
 *   ])
 * );
 */
export function withOrgIds<T extends Record<string, any>>(
  organisationId: string,
  valuesArray: T[]
): Array<T & { organisationId: string }> {
  return valuesArray.map(values => withOrgId(organisationId, values));
}

/**
 * Validate that a record belongs to the current organisation
 * Throws error if validation fails
 * Super admins (organisationId="*") bypass validation
 * 
 * @example
 * const caseRecord = await db.select()...;
 * validateOrgAccess(organisationId, caseRecord, 'Case');
 */
export function validateOrgAccess(
  organisationId: string,
  record: { organisationId?: string } | null | undefined,
  resourceName: string = "Resource"
): void {
  if (!record) {
    throw new Error(`${resourceName} not found`);
  }
  
  // Super admins bypass organisation validation
  if (organisationId === "*") {
    return;
  }
  
  if (record.organisationId !== organisationId) {
    throw new Error(`Access denied: ${resourceName} does not belong to your organisation`);
  }
}

/**
 * Check if a record belongs to the current organisation (non-throwing)
 * Super admins (organisationId="*") always have access
 * 
 * @example
 * const caseRecord = await db.select()...;
 * if (hasOrgAccess(organisationId, caseRecord)) {
 *   // proceed
 * }
 */
export function hasOrgAccess(
  organisationId: string,
  record: { organisationId?: string } | null | undefined
): boolean {
  // Super admins have access to all records
  if (organisationId === "*") {
    return record != null;
  }
  
  return record != null && record.organisationId === organisationId;
}
