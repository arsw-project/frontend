import z from 'zod';

export type EditUserFormState = z.infer<typeof stateSchema>;

export type UserApi = {
	id: string;
	name: string;
	email: string;
	authProvider: string;
	providerId: string | null;
	role: string;
	createdAt: string;
	updatedAt: string;
};

const stateSchema = z.object({
	name: z.string(),
	email: z.string(),
	role: z.enum(['user', 'admin', 'system']),
});

export const createEditUserForm = (messages: {
	nameRequired: string;
	emailRequired: string;
	invalidEmail: string;
}) => {
	const validationRules = {
		name: z.string().min(1, messages.nameRequired),
		email: z
			.string()
			.min(1, messages.emailRequired)
			.email(messages.invalidEmail),
		role: z.enum(['user', 'admin', 'system']),
	};

	const validationSchema = z
		.object({
			name: validationRules.name,
			email: validationRules.email,
			role: validationRules.role,
		})
		.transform((data) => {
			return { name: data.name, email: data.email, role: data.role };
		});

	return {
		stateSchema,
		validationRules,
		validationSchema,
	};
};

const apiValidationSchema = z
	.object({
		name: z.string().min(1),
		email: z.string().email(),
		role: z.enum(['user', 'admin', 'system']),
	})
	.transform((data) => {
		return { name: data.name, email: data.email, role: data.role };
	});

export { apiValidationSchema };
