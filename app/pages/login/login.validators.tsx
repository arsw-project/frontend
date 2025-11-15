import z from 'zod';

export type LoginFormState = z.infer<typeof stateSchema>;

const stateSchema = z.object({
	email: z.string(),
	password: z.string(),
	showPassword: z.boolean(),
	rememberMe: z.boolean(),
});

export const createLoginForm = (messages: {
	emailRequired: string;
	invalidEmail: string;
	passwordRequired: string;
}) => {
	const validationRules = {
		email: z
			.string()
			.min(1, messages.emailRequired)
			.email(messages.invalidEmail),
		password: z.string().nonempty(messages.passwordRequired),
		showPassword: z.boolean(),
		rememberMe: z.boolean(),
	};

	const validationSchema = z
		.object({
			email: validationRules.email,
			password: validationRules.password,
			showPassword: validationRules.showPassword,
			rememberMe: validationRules.rememberMe,
		})
		.transform((data) => {
			return { email: data.email, password: data.password };
		});

	return {
		stateSchema,
		validationRules,
		validationSchema,
	};
};

const apiValidationSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(1),
		showPassword: z.boolean(),
		rememberMe: z.boolean(),
	})
	.transform((data) => {
		return { email: data.email, password: data.password };
	});

export { apiValidationSchema };
