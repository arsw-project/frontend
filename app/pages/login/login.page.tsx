import {
	Alert,
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
	GoogleLogoIcon,
	LockIcon,
} from '@phosphor-icons/react';
import { useLoginMutation } from '@providers/session.provider';
import { FieldError } from '@shared/components/field-error/field-error.component';
import { FieldIcon } from '@shared/components/field-icon/field-icon.component';
import { LocaleSwitcher } from '@shared/components/locale-switcher/locale-switcher.component';
import { useErrorParser, zodErrorToErrorMap } from '@shared/utility/errors';
import { dataAttr } from '@shared/utility/props';
import { useForm } from '@tanstack/react-form';
import { type FormEvent, memo, useCallback } from 'react';
import { useIntlayer } from 'react-intlayer';
import { useNavigate } from 'react-router';
import { LoginForm, type LoginFormState } from './login.validators';

const LoginPage = memo(() => {
	const { parseFieldErrors } = useErrorParser();
	const {
		title,
		subtitle,
		emailLabel,
		emailPlaceholder,
		passwordLabel,
		passwordPlaceholder,
		rememberMe,
		forgotPassword,
		signIn,
		orContinueWith,
		continueWithGoogle,
		noAccount,
		createAccount,
		tryGoogle,
		showPassword,
		hidePassword,
	} = useIntlayer('login');

	const navigate = useNavigate();
	const loginMutation = useLoginMutation({
		onSuccess: () => {
			navigate('/', { replace: true });
		},
		onApiError: (error) => {
			loginForm.setErrorMap(zodErrorToErrorMap(error));
		},
		onValidationError: (error) => {
			loginForm.setErrorMap(zodErrorToErrorMap(error));
		},
	});

	const loginForm = useForm({
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
			showPassword: false,
		} as LoginFormState,

		onSubmit: async ({ value }) => {
			try {
				await loginMutation.execute(value);
			} catch {
				console.log('Login failed');
			}
		},
	});

	const handleSubmit = useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			event.stopPropagation();
			loginForm.handleSubmit({ loginMethod: 'email' });
		},
		[loginForm],
	);

	const handleGoogleSubmit = useCallback(() => {
		window.location.replace('/api/auth/google/login');
	}, []);

	const toggleShowPassword = useCallback(() => {
		loginForm.setFieldValue('showPassword', (current) => !current);
	}, [loginForm]);

	return (
		<div
			className={cn(
				'flex min-h-screen w-full flex-col items-center justify-center bg-background p-6',
			)}
		>
			<div className={cn(['absolute top-6 right-6'])}>
				<LocaleSwitcher />
			</div>

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
							{title}
						</h1>
						<p className={cn('text-foreground-500 text-small leading-small')}>
							{subtitle}
						</p>
					</div>

					<Form
						validationBehavior="aria"
						onSubmit={handleSubmit}
						className={cn('space-y-5')}
						data-loading={dataAttr(loginMutation.isLoading)}
					>
						<loginForm.Field
							name="email"
							validators={{ onBlur: LoginForm.validationRules.email }}
						>
							{(field) => (
								<Input
									label={emailLabel}
									placeholder={emailPlaceholder.value}
									variant="bordered"
									name={field.name}
									value={field.state.value}
									onValueChange={field.handleChange}
									onBlur={field.handleBlur}
									isInvalid={!field.state.meta.isValid}
									errorMessage={
										<FieldError
											errors={parseFieldErrors(field.state.meta.errors)}
											maxDisplayLength={60}
											color="danger"
											size="sm"
										/>
									}
									color={!field.state.meta.isValid ? 'danger' : 'primary'}
									isRequired
									startContent={
										<FieldIcon>
											<EnvelopeSimpleIcon size={18} />
										</FieldIcon>
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
											label={passwordLabel}
											placeholder={passwordPlaceholder.value}
											value={passwordField.state.value}
											onValueChange={passwordField.handleChange}
											onBlur={passwordField.handleBlur}
											isRequired
											isInvalid={!passwordField.state.meta.isValid}
											errorMessage={
												<FieldError
													errors={parseFieldErrors(
														passwordField.state.meta.errors,
													)}
													maxDisplayLength={60}
													color="danger"
													size="sm"
												/>
											}
											variant="bordered"
											color={
												!passwordField.state.meta.isValid ? 'danger' : 'primary'
											}
											startContent={
												<FieldIcon>
													<LockIcon size={18} />
												</FieldIcon>
											}
											endContent={
												<Button
													isIconOnly
													size="sm"
													variant="light"
													radius="full"
													aria-label={
														showPasswordField.state.value
															? hidePassword.value
															: showPassword.value
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

						<loginForm.Subscribe
							selector={(state) => state.values.email.endsWith('@gmail.com')}
						>
							{(showGoogleBanner) =>
								showGoogleBanner && (
									<Alert
										color="primary"
										variant="faded"
										className={cn('mb-2 text-small')}
									>
										{tryGoogle}
									</Alert>
								)
							}
						</loginForm.Subscribe>

						<div className={cn('flex items-center gap-1')}>
							<loginForm.Field name="rememberMe">
								{(field) => (
									<Checkbox
										size="sm"
										isSelected={field.state.value}
										onValueChange={field.handleChange}
										classNames={{ label: 'text-foreground-600' }}
									>
										{rememberMe}
									</Checkbox>
								)}
							</loginForm.Field>

							<Link
								color="primary"
								href="/auth/forgot-password"
								underline="hover"
							>
								{forgotPassword}
							</Link>
						</div>

						<div className={cn('flex w-full flex-col gap-2')}>
							<loginForm.Subscribe selector={(state) => state.isValid}>
								{(isFormValid) => (
									<Button
										type="submit"
										color="primary"
										variant="solid"
										fullWidth
										radius="md"
										isDisabled={!isFormValid || loginMutation.isLoading}
										isLoading={loginMutation.isLoading}
										endContent={<ArrowRightIcon size={18} />}
										className={cn('mt-1')}
									>
										{signIn}
									</Button>
								)}
							</loginForm.Subscribe>

							<div className={cn('relative my-2')}>
								<div className={cn('absolute inset-0 flex items-center')}>
									<div className={cn('w-full border-divider border-t')} />
								</div>
								<div className={cn('relative flex justify-center text-small')}>
									<span className={cn('bg-content1 px-2 text-foreground-500')}>
										{orContinueWith}
									</span>
								</div>
							</div>

							<Button
								type="button"
								color="default"
								variant="bordered"
								fullWidth
								radius="md"
								isDisabled={loginMutation.isLoading}
								startContent={<GoogleLogoIcon size={18} />}
								onPress={handleGoogleSubmit}
								className={cn('mt-1')}
							>
								{continueWithGoogle}
							</Button>
						</div>
					</Form>

					<p className={cn('text-foreground-500 text-small')}>
						{noAccount}{' '}
						<Link href="/auth/register" color="primary" underline="hover">
							{createAccount}
						</Link>
					</p>
				</CardBody>
			</Card>
		</div>
	);
});

LoginPage.displayName = 'LoginPage';

export default LoginPage;
