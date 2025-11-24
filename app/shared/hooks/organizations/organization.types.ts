import { z } from 'zod';

// Organization API Types
export type OrganizationApi = {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
};

// Membership API Types
export type MembershipRole = 'owner' | 'admin' | 'member' | 'viewer';

export type MembershipApi = {
	id: string;
	userId: string;
	organizationId: string;
	role: MembershipRole;
	createdAt: string;
	updatedAt: string;
	user?: {
		id: string;
		name: string;
		email: string;
	};
};

// Create Organization Payload
export type CreateOrganizationPayload = {
	name: string;
	description: string;
};

// Update Organization Payload
export type UpdateOrganizationPayload = {
	name?: string;
	description?: string;
};

// Create Organization Response
export type CreateOrganizationResponse = {
	organization: OrganizationApi;
};

// Update Organization Response
export type UpdateOrganizationResponse = {
	organization: OrganizationApi;
};

// Add Member Payload
export type AddMemberPayload = {
	userId: string;
	role?: MembershipRole;
};

// Update Member Payload
export type UpdateMemberPayload = {
	role: MembershipRole;
};

// Add Member Response
export type AddMemberResponse = {
	membership: MembershipApi;
};

// Update Member Response
export type UpdateMemberResponse = {
	membership: MembershipApi;
};

// Validation Schemas
export const createOrganizationSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
});

export const updateOrganizationSchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
});

export const addMemberSchema = z.object({
	userId: z.string().uuid(),
	role: z.enum(['owner', 'admin', 'member', 'viewer']).optional(),
});

export const updateMemberSchema = z.object({
	role: z.enum(['owner', 'admin', 'member', 'viewer']),
});
