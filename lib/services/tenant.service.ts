import { db } from "../drizzle/connection";
import { organizations, organizationMembers } from "../drizzle/schema/organization-schema";
import { user } from "../drizzle/schema/auth-schema";
import { eq, and } from "drizzle-orm";

/**
 * Tenant Context Service
 * Handles organization/tenant context extraction and validation
 */

export interface TenantContext {
    organizationId: string;
    userId: string;
    isSuperAdmin: boolean;
}

/**
 * Get the user's current organization context
 */
export async function getUserTenantContext(
    userId: string
): Promise<TenantContext | null> {
    const [userRecord] = await db.select().from(user).where(eq(user.id, userId));

    if (!userRecord) {
        return null;
    }

    // If user has a current organization set, use that
    if (userRecord.currentOrganizationId) {
        return {
            organizationId: userRecord.currentOrganizationId,
            userId: userRecord.id,
            isSuperAdmin: userRecord.isSuperAdmin,
        };
    }

    // Otherwise, get their primary organization
    const primaryMembership = await db.select().from(organizationMembers).where(
        and(
            eq(organizationMembers.userId, userId),
            eq(organizationMembers.isPrimary, true),
            eq(organizationMembers.isActive, true)
        )
    ).limit(1).then(results => results[0]);

    if (primaryMembership) {
        return {
            organizationId: primaryMembership.organizationId,
            userId: userRecord.id,
            isSuperAdmin: userRecord.isSuperAdmin,
        };
    }

    // If no primary, get any active membership
    const anyMembership = await db.select().from(organizationMembers).where(
        and(
            eq(organizationMembers.userId, userId),
            eq(organizationMembers.isActive, true)
        )
    ).limit(1).then(results => results[0]);

    if (anyMembership) {
        return {
            organizationId: anyMembership.organizationId,
            userId: userRecord.id,
            isSuperAdmin: userRecord.isSuperAdmin,
        };
    }

    return null;
}

/**
 * Verify that a user has access to a specific organization
 */
export async function verifyUserOrganizationAccess(
    userId: string,
    organizationId: string
): Promise<boolean> {
    const userRecord = await db.select().from(user).where(eq(user.id, userId)).limit(1).then(results => results[0]);

    // Super admins have access to all organizations
    if (userRecord?.isSuperAdmin) {
        return true;
    }

    // Check if user is a member of this organization
    const membership = await db.select().from(organizationMembers).where(
        and(
            eq(organizationMembers.userId, userId),
            eq(organizationMembers.organizationId, organizationId),
            eq(organizationMembers.isActive, true)
        )
    ).limit(1).then(results => results[0]);

    return !!membership;
}

/**
 * Get all organizations a user has access to
 */
export async function getUserOrganizations(userId: string) {
    const memberships = await db
        .select({
            organization: organizations,
            membership: organizationMembers,
        })
        .from(organizationMembers)
        .innerJoin(organizations, eq(organizations.id, organizationMembers.organizationId))
        .where(
            and(
                eq(organizationMembers.userId, userId),
                eq(organizationMembers.isActive, true),
                eq(organizations.isActive, true)
            )
        );

    return memberships;
}

/**
 * Switch user's current organization context
 */
export async function switchUserOrganization(
    userId: string,
    organizationId: string
): Promise<boolean> {
    // Verify user has access to this organization
    const hasAccess = await verifyUserOrganizationAccess(userId, organizationId);

    if (!hasAccess) {
        return false;
    }

    // Update user's current organization
    await db
        .update(user)
        .set({
            currentOrganizationId: organizationId,
            updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

    return true;
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(organizationId: string) {
    return await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1).then(results => results[0]);
}

/**
 * Check if organization exists and is active
 */
export async function isOrganizationActive(organizationId: string): Promise<boolean> {
    const org = await db.select().from(organizations).where(
        and(
            eq(organizations.id, organizationId),
            eq(organizations.isActive, true)
        )
    ).limit(1).then(results => results[0]);

    return !!org;
}
