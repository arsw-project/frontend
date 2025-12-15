import z from 'zod';

export const ticketStatusSchema = z
	.enum(['Open', 'In Progress', 'Done'])
	.default('Open');

export const ticketDifficultySchema = z.enum(['S', 'M', 'L']);

export type TicketStatus = z.infer<typeof ticketStatusSchema>;
export type TicketDifficulty = z.infer<typeof ticketDifficultySchema>;

// Ticket API Types
export type CreateTicketPayload = {
	orgId: string;
	title: string;
	description: string;
	acceptanceCriteria: string[];
	status: TicketStatus;
	assigneeId: string | null;
	difficulty: TicketDifficulty;
	tags: string[];
	createdBy: string;
};

export const createTicketSchema = z.object({
	orgId: z.string(),
	title: z.string().min(1),
	description: z.string().min(1),
	acceptanceCriteria: z.array(z.string()).min(1),
	status: ticketStatusSchema,
	assigneeId: z.string().nullable(),
	difficulty: ticketDifficultySchema,
	tags: z.array(z.string()).min(1),
	createdBy: z.string(),
});

/**
 * Backend response shape is not enforced here yet.
 * When ticket listing is implemented, tighten this type based on the API contract.
 */
export type CreateTicketResponse = unknown;

const createTicketStateSchema = z.object({
	orgId: z.string(),
	title: z.string(),
	description: z.string(),
	acceptanceCriteria: z.array(z.string()),
	newAcceptanceCriteria: z.string(),
	status: ticketStatusSchema,
	assigneeId: z.string().nullable(),
	difficulty: ticketDifficultySchema,
	tags: z.array(z.string()),
	newTag: z.string(),
	createdBy: z.string(),
});

export type CreateTicketFormState = z.infer<typeof createTicketStateSchema>;

export const createTicketForm = () => {
	const validationRules = {
		orgId: z.string(),
		title: z.string().min(1, 'Title is required'),
		description: z.string().min(1, 'Description is required'),
		acceptanceCriteria: z
			.array(z.string())
			.min(1, 'Acceptance criteria is required'),
		status: ticketStatusSchema,
		assigneeId: z.string().nullable().optional(),
		difficulty: ticketDifficultySchema,
		tags: z.array(z.string()).min(1, 'At least one tag is required'),
		createdBy: z.string(),
	};

	const validationSchema = z
		.object({
			orgId: validationRules.orgId,
			title: validationRules.title,
			description: validationRules.description,
			acceptanceCriteria: validationRules.acceptanceCriteria,
			status: validationRules.status,
			assigneeId: validationRules.assigneeId,
			difficulty: validationRules.difficulty,
			tags: validationRules.tags,
			createdBy: validationRules.createdBy,
		})
		.transform((data) => {
			return {
				orgId: data.orgId,
				title: data.title.trim(),
				description: data.description.trim(),
				acceptanceCriteria: data.acceptanceCriteria.map((c) => c.trim()),
				status: data.status,
				assigneeId: data.assigneeId ?? null,
				difficulty: data.difficulty,
				tags: data.tags.map((t) => t.trim()),
				createdBy: data.createdBy,
			};
		});

	return {
		stateSchema: createTicketStateSchema,
		validationRules,
		validationSchema,
	};
};

export type CreateTicketOutput = z.infer<
	ReturnType<typeof createTicketForm>['validationSchema']
>;
