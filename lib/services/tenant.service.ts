import { db } from "../drizzle/connection";
import { organisations, organisationMembers } from "../drizzle/schema/organisation-schema";
import { user } from "../drizzle/schema/auth-schema";
import { eq, and } from "drizzle-orm";

/**
 * Tenant Context Service
 * Handles organisation/tenant context extraction and validation
 */

export interface TenantContext {
    organisationId: string;
    userId: string;
    isSuperAdmin: boolean;
}

/**
 * Get the user's current organisation context
 * Super admins get special context that bypasses organisation restrictions
 */
export async function getUserTenantContext(
    userId: string
): Promise<TenantContext | null> {
    const [userRecord] = await db.select().from(user).where(eq(user.id, userId));

    if (!userRecord) {
        return null;
    }

    // Super admins get a special context with "*" organisation ID
    // This signals to query helpers and authorization checks to bypass org filtering
    if (userRecord.isSuperAdmin) {
        // If super admin has a current org set, use it (allows them to switch context)
        // Otherwise, use "*" to indicate omnipotent access
        return {
            organisationId: userRecord.currentOrganisationId || "*",
            userId: userRecord.id,
            isSuperAdmin: true,
        };
    }

    // If user has a current organisation set, use that
    if (userRecord.currentOrganisationId) {
        return {
            organisationId: userRecord.currentOrganisationId,
            userId: userRecord.id,
            isSuperAdmin: userRecord.isSuperAdmin,
        };
    }

    // Otherwise, get their primary organisation
    const primaryMembership = await db.select().from(organisationMembers).where(
        and(
            eq(organisationMembers.userId, userId),
            eq(organisationMembers.isPrimary, true),
            eq(organisationMembers.isActive, true)
        )
    ).limit(1).then(results => results[0]);

    if (primaryMembership) {
        return {
            organisationId: primaryMembership.organisationId,
            userId: userRecord.id,
            isSuperAdmin: userRecord.isSuperAdmin,
        };
    }

    // If no primary, get any active membership
    const anyMembership = await db.select().from(organisationMembers).where(
        and(
            eq(organisationMembers.userId, userId),
            eq(organisationMembers.isActive, true)
        )
    ).limit(1).then(results => results[0]);

    if (anyMembership) {
        return {
            organisationId: anyMembership.organisationId,
            userId: userRecord.id,
            isSuperAdmin: userRecord.isSuperAdmin,
        };
    }

    // Non-super-admin users without any organisation membership
    return null;
}

/**
 * Verify that a user has access to a specific organisation
 */
export async function verifyUserOrganisationAccess(
    userId: string,
    organisationId: string
): Promise<boolean> {
    const userRecord = await db.select().from(user).where(eq(user.id, userId)).limit(1).then(results => results[0]);

    // Super admins have access to all organisations
    if (userRecord?.isSuperAdmin) {
        return true;
    }

    // Check if user is a member of this organisation
    const membership = await db.select().from(organisationMembers).where(
        and(
            eq(organisationMembers.userId, userId),
            eq(organisationMembers.organisationId, organisationId),
            eq(organisationMembers.isActive, true)
        )
    ).limit(1).then(results => results[0]);

    return !!membership;
}

/**
 * Get all organisations a user has access to
 * Super admins get access to ALL organisations
 */
export async function getUserOrganisations(userId: string) {
    const [userRecord] = await db.select().from(user).where(eq(user.id, userId));

    // Super admins have access to all organisations
    if (userRecord?.isSuperAdmin) {
        const allOrgs = await db
            .select()
            .from(organisations)
            .where(eq(organisations.isActive, true));
        
        // Return in the same format as regular memberships
        return allOrgs.map(org => ({
            organisation: org,
            membership: {
                id: `super-admin-${org.id}`,
                userId: userId,
                organisationId: org.id,
                isPrimary: false,
                isActive: true,
                joinedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                leftAt: null,
            },
        }));
    }

    const memberships = await db
        .select({
            organisation: organisations,
            membership: organisationMembers,
        })
        .from(organisationMembers)
        .innerJoin(organisations, eq(organisations.id, organisationMembers.organisationId))
        .where(
            and(
                eq(organisationMembers.userId, userId),
                eq(organisationMembers.isActive, true),
                eq(organisations.isActive, true)
            )
        );

    return memberships;
}

/**
 * Switch user's current organisation context
 */
export async function switchUserOrganisation(
    userId: string,
    organisationId: string
): Promise<boolean> {
    // Verify user has access to this organisation
    const hasAccess = await verifyUserOrganisationAccess(userId, organisationId);

    if (!hasAccess) {
        return false;
    }

    // Update user's current organisation
    await db
        .update(user)
        .set({
            currentOrganisationId: organisationId,
            updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

    return true;
}

/**
 * Get organisation by ID
 */
export async function getOrganisationById(organisationId: string) {
    return await db.select().from(organisations).where(eq(organisations.id, organisationId)).limit(1).then(results => results[0]);
}

/**
 * Check if organisation exists and is active
 */
export async function isOrganisationActive(organisationId: string): Promise<boolean> {
    const org = await db.select().from(organisations).where(
        and(
            eq(organisations.id, organisationId),
            eq(organisations.isActive, true)
        )
    ).limit(1).then(results => results[0]);

    return !!org;
}
