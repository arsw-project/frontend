import {
	Button,
	Card,
	CardBody,
	Checkbox,
	cn,
	Form,
	Input,
	Link,
} from '@heroui/react';
import {
	ArrowRightIcon,
	EnvelopeSimpleIcon,
	EyeIcon,
	EyeSlashIcon,
	LockIcon,
} from '@phosphor-icons/react';
import { dataAttr } from '@shared/utility/props';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { type FormEvent, memo, useCallback } from 'react';
import { LoginForm, type LoginFormState } from './login.validators';

const LoginPage = memo(() => {
	const loginMutation = useMutation({
		mutationKey: ['login'],
		mutationFn: async () => {
			// Simulate a login API call
			return new Promise((resolve) => setTimeout(resolve, 2000));
		},
	});

	const loginForm = useForm({
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
			showPassword: false,
		} as LoginFormState,
		onSubmit: async (values) => {
			try {
				await loginMutation.mutateAsync();
				// Handle successful login (e.g., redirect to dashboard)
				console.log('Login successful', values);
			} catch (error) {
				// Handle login error (e.g., show error message)
				console.error('Login failed', error);
			}
		},
	});

	const handleSubmit = useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			event.stopPropagation();
			loginForm.handleSubmit();
		},
		[loginForm],
	);

	const toggleShowPassword = useCallback(() => {
		loginForm.setFieldValue('showPassword', (current) => !current);
	}, [loginForm]);

	return (
		<div
			className={cn(
				'flex min-h-screen w-full items-center justify-center bg-background p-6',
			)}
		>
			<Card
				shadow="md"
				radius="lg"
				className={cn('w-full max-w-md bg-content1 shadow-medium')}
			>
				<CardBody className={cn('space-y-6 p-6 sm:p-8')}>
					<div className={cn('space-y-1')}>
						<h1
							className={cn(
								'font-semibold text-foreground text-large leading-large',
							)}
						>
							Sign in
						</h1>
						<p className={cn('text-foreground-500 text-small leading-small')}>
							Welcome back, we're glad to see you.
						</p>
					</div>

					<Form
						validationBehavior="aria"
						onSubmit={handleSubmit}
						className={cn('space-y-5')}
						data-loading={dataAttr(loginMutation.isPending)}
					>
						<loginForm.Field
							name="email"
							validators={{ onBlur: LoginForm.validationRules.email }}
						>
							{(field) => (
								<Input
									label="Email"
									placeholder="your@email.com"
									variant="bordered"
									name={field.name}
									value={field.state.value}
									onValueChange={field.handleChange}
									onBlur={field.handleBlur}
									isInvalid={!field.state.meta.isValid}
									errorMessage={String(field.state.meta.errors)}
									color={!field.state.meta.isValid ? 'danger' : 'primary'}
									isRequired
									startContent={
										<EnvelopeSimpleIcon
											size={18}
											className={cn('text-foreground-500')}
										/>
									}
								/>
							)}
						</loginForm.Field>

						<loginForm.Field
							name="password"
							validators={{
								onBlur: LoginForm.validationRules.password,
							}}
						>
							{(passwordField) => (
								<loginForm.Field name="showPassword">
									{(showPasswordField) => (
										<Input
											name="password"
											type={showPasswordField.state.value ? 'text' : 'password'}
											label="Password"
											placeholder="Your password"
											value={passwordField.state.value}
											onValueChange={passwordField.handleChange}
											onBlur={passwordField.handleBlur}
											isRequired
											isInvalid={!passwordField.state.meta.isValid}
											errorMessage={String(passwordField.state.meta.errors)}
											variant="bordered"
											color={
												!passwordField.state.meta.isValid ? 'danger' : 'primary'
											}
											startContent={
												<LockIcon
													size={18}
													className={cn('text-foreground-500')}
												/>
											}
											endContent={
												<Button
													isIconOnly
													size="sm"
													variant="light"
													radius="full"
													aria-label={
														showPasswordField.state.value
															? 'Hide password'
															: 'Show password'
													}
													onPress={toggleShowPassword}
													className={cn('text-foreground-500')}
												>
													{showPasswordField.state.value ? (
														<EyeSlashIcon size={18} />
													) : (
														<EyeIcon size={18} />
													)}
												</Button>
											}
										/>
									)}
								</loginForm.Field>
							)}
						</loginForm.Field>

						<div className={cn('flex items-center gap-1')}>
							<loginForm.Field name="rememberMe">
								{(field) => (
									<Checkbox
										size="sm"
										isSelected={field.state.value}
										onValueChange={field.handleChange}
										classNames={{ label: 'text-foreground-600' }}
									>
										Remember me
									</Checkbox>
								)}
							</loginForm.Field>

							<Link
								color="primary"
								href="/auth/forgot-password"
								underline="hover"
							>
								Forgot your password?
							</Link>
						</div>

						<loginForm.Subscribe selector={(state) => state.isValid}>
							{(isFormValid) => (
								<Button
									type="submit"
									color="primary"
									variant="solid"
									fullWidth
									radius="md"
									isDisabled={!isFormValid || loginMutation.isPending}
									isLoading={loginMutation.isPending}
									endContent={<ArrowRightIcon size={18} />}
									className={cn('mt-2')}
								>
									Sign in
								</Button>
							)}
						</loginForm.Subscribe>
					</Form>

					<p className={cn('text-foreground-500 text-small')}>
						Don't have an account?{' '}
						<Link href="/auth/register" color="primary" underline="hover">
							Create account
						</Link>
					</p>
				</CardBody>
			</Card>
		</div>
	);
});

LoginPage.displayName = 'LoginPage';

export default LoginPage;
