import { type Dictionary, t } from 'intlayer';

const loginContent = {
	key: 'login',
	content: {
		title: t({
			en: 'Sign in',
			es: 'Iniciar Sesión',
		}),
		subtitle: t({
			en: "Welcome back, we're glad to see you.",
			es: 'Bienvenido de nuevo, nos alegra verte.',
		}),
		emailLabel: t({
			en: 'Email',
			es: 'Correo Electrónico',
		}),
		emailPlaceholder: t({
			en: 'your@email.com',
			es: 'tu@email.com',
		}),
		passwordLabel: t({
			en: 'Password',
			es: 'Contraseña',
		}),
		passwordPlaceholder: t({
			en: 'Your password',
			es: 'Tu contraseña',
		}),
		rememberMe: t({
			en: 'Remember me',
			es: 'Recuérdame',
		}),
		forgotPassword: t({
			en: 'Forgot your password?',
			es: '¿Olvidaste tu contraseña?',
		}),
		signIn: t({
			en: 'Sign in',
			es: 'Iniciar Sesión',
		}),
		orContinueWith: t({
			en: 'Or continue with other methods',
			es: 'O continúa con otros métodos',
		}),
		continueWithGoogle: t({
			en: 'Continue with Google',
			es: 'Continuar con Google',
		}),
		noAccount: t({
			en: "Don't have an account?",
			es: '¿No tienes cuenta?',
		}),
		createAccount: t({
			en: 'Create account',
			es: 'Crear cuenta',
		}),
		tryGoogle: t({
			en: "Why not try Google sign-in? It's easier!",
			es: '¿Por qué no intentar iniciar sesión con Google? ¡Es más fácil!',
		}),
		showPassword: t({
			en: 'Show password',
			es: 'Mostrar contraseña',
		}),
		hidePassword: t({
			en: 'Hide password',
			es: 'Ocultar contraseña',
		}),
	},
} satisfies Dictionary;

export default loginContent;
