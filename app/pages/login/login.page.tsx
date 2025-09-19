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
import { memo, useCallback, useMemo, useState } from 'react';

const emailRegex =
	/^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const LoginPage = memo(() => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [touched, setTouched] = useState<{ email: boolean; password: boolean }>(
		{ email: false, password: false },
	);

	const isEmailValid = useMemo(() => emailRegex.test(email.trim()), [email]);
	const isPasswordValid = useMemo(
		() => password.trim().length >= 6,
		[password],
	);
	const isFormValid = useMemo(
		() => isEmailValid && isPasswordValid,
		[isEmailValid, isPasswordValid],
	);

	const emailError = useMemo(() => {
		if (!touched.email) return undefined;
		if (!email) return 'Email is required';
		if (!isEmailValid) return 'Enter a valid email';
		return undefined;
	}, [email, isEmailValid, touched.email]);

	const passwordError = useMemo(() => {
		if (!touched.password) return undefined;
		if (!password) return 'Password is required';
		if (!isPasswordValid) return 'Minimum 6 characters';
		return undefined;
	}, [password, isPasswordValid, touched.password]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setTouched({ email: true, password: true });
			if (!isFormValid) return;

			setIsLoading(true);
			try {
				await new Promise((res) => setTimeout(res, 1200));
				// navigate('/dashboard');
			} finally {
				setIsLoading(false);
			}
		},
		[isFormValid],
	);

	const onEmailChange = useCallback((value: string) => {
		setEmail(value);
	}, []);

	const onPasswordChange = useCallback((value: string) => {
		setPassword(value);
	}, []);

	const onRememberChange = useCallback((value: boolean) => {
		setRemember(value);
	}, []);

	const toggleShowPassword = useCallback(() => {
		setShowPassword((v) => !v);
	}, []);

	const onEmailBlur = useCallback(
		() => setTouched((t) => ({ ...t, email: true })),
		[],
	);
	const onPasswordBlur = useCallback(
		() => setTouched((t) => ({ ...t, password: true })),
		[],
	);

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
						data-loading={dataAttr(isLoading)}
					>
						<Input
							name="email"
							type="email"
							label="Email"
							placeholder="your@email.com"
							value={email}
							onValueChange={onEmailChange}
							onBlur={onEmailBlur}
							isRequired
							isInvalid={!!emailError}
							errorMessage={emailError}
							variant="bordered"
							color={emailError ? 'danger' : 'primary'}
							startContent={
								<EnvelopeSimpleIcon
									size={18}
									className={cn('text-foreground-500')}
								/>
							}
						/>

						<Input
							name="password"
							type={showPassword ? 'text' : 'password'}
							label="Password"
							placeholder="Your password"
							value={password}
							onValueChange={onPasswordChange}
							onBlur={onPasswordBlur}
							isRequired
							isInvalid={!!passwordError}
							errorMessage={passwordError}
							variant="bordered"
							color={passwordError ? 'danger' : 'primary'}
							startContent={
								<LockIcon size={18} className={cn('text-foreground-500')} />
							}
							endContent={
								<Button
									isIconOnly
									size="sm"
									variant="light"
									radius="full"
									aria-label={showPassword ? 'Hide password' : 'Show password'}
									onPress={toggleShowPassword}
									className={cn('text-foreground-500')}
								>
									{showPassword ? (
										<EyeSlashIcon size={18} />
									) : (
										<EyeIcon size={18} />
									)}
								</Button>
							}
						/>

						<div className={cn('flex items-center gap-1')}>
							<Checkbox
								size="sm"
								isSelected={remember}
								onValueChange={onRememberChange}
								classNames={{ label: 'text-foreground-600' }}
							>
								Remember me
							</Checkbox>

							<Link
								color="primary"
								href="/auth/forgot-password"
								underline="hover"
							>
								Forgot your password?
							</Link>
						</div>

						<Button
							type="submit"
							color="primary"
							variant="solid"
							fullWidth
							radius="md"
							isDisabled={!isFormValid || isLoading}
							isLoading={isLoading}
							endContent={<ArrowRightIcon size={18} />}
							className={cn('mt-2')}
						>
							Sign in
						</Button>
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
