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
			error: 'login.emailRequired',
		}),
		z.email({ error: 'login.emailInvalid' }),
	),
	password: z.string().nonempty('login.passwordRequired').min(8, {
		error: 'login.passwordMinLength',
	}),
};

const validationSchema = z
	.object({
		email: validationRules.email,
		password: validationRules.password,
	})
	.transform((data) => {
		return { ...data };
	});

export const LoginForm = {
	stateSchema,
	validationRules,
	validationSchema,
};
