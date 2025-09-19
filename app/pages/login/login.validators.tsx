import z from 'zod';

export type LoginFormState = z.infer<typeof LoginForm.stateSchema>;

const stateSchema = z.object({
	email: z.string(),
	password: z.string(),
	showPassword: z.boolean(),
	rememberMe: z.boolean(),
});

const validationRules = {
	email: z.pipe(
		z.string().min(1, {
			error: 'Email is required',
		}),
		z.email({ error: 'Invalid email address' }),
	),
	password: z.string().nonempty('Password is required').min(8, {
		error: 'Password must be at least 8 characters long',
	}),
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

export const LoginForm = {
	stateSchema,
	validationRules,
	validationSchema,
};
