import z from 'zod';

export type CreateOrganizationFormState = z.infer<typeof createStateSchema>;
export type EditOrganizationFormState = z.infer<typeof editStateSchema>;

const createStateSchema = z.object({
	name: z.string(),
	description: z.string(),
});

const editStateSchema = z.object({
	name: z.string(),
	description: z.string(),
});

export const createOrganizationForm = (messages: {
	nameRequired: string;
	descriptionRequired: string;
	nameMinLength: string;
	descriptionMinLength: string;
}) => {
	const validationRules = {
		name: z
			.string()
			.min(1, messages.nameRequired)
			.min(2, messages.nameMinLength),
		description: z
			.string()
			.min(1, messages.descriptionRequired)
			.min(10, messages.descriptionMinLength),
	};

	const validationSchema = z
		.object({
			name: validationRules.name,
			description: validationRules.description,
		})
		.transform((data) => {
			return { name: data.name.trim(), description: data.description.trim() };
		});

	return {
		stateSchema: createStateSchema,
		validationRules,
		validationSchema,
	};
};

export const createEditOrganizationForm = (messages: {
	nameRequired: string;
	descriptionRequired: string;
	nameMinLength: string;
	descriptionMinLength: string;
}) => {
	const validationRules = {
		name: z
			.string()
			.min(1, messages.nameRequired)
			.min(2, messages.nameMinLength),
		description: z
			.string()
			.min(1, messages.descriptionRequired)
			.min(10, messages.descriptionMinLength),
	};

	const validationSchema = z
		.object({
			name: validationRules.name,
			description: validationRules.description,
		})
		.transform((data) => {
			return { name: data.name.trim(), description: data.description.trim() };
		});

	return {
		stateSchema: editStateSchema,
		validationRules,
		validationSchema,
	};
};
