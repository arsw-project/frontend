import { type Dictionary, t } from 'intlayer';

const termsContent = {
	key: 'terms',
	content: {
		title: t({
			en: 'Terms of Service',
			es: 'Términos de Servicio',
		}),
		lastUpdated: t({
			en: 'Last updated',
			es: 'Última actualización',
		}),
		backToHome: t({
			en: 'Back to home',
			es: 'Volver al inicio',
		}),
		acceptance: {
			title: t({
				en: 'Acceptance of Terms',
				es: 'Aceptación de Términos',
			}),
			content: t({
				en: 'By accessing and using this ticket management platform, you accept and agree to be bound by the terms and conditions of this agreement.',
				es: 'Al acceder y usar esta plataforma de gestión de tickets, aceptas y te comprometes a cumplir los términos y condiciones de este acuerdo.',
			}),
		},
		serviceDescription: {
			title: t({
				en: 'Service Description',
				es: 'Descripción del Servicio',
			}),
			content: t({
				en: 'Our platform provides ticket management, video conferencing, real-time collaboration, and organizational tools for teams. We reserve the right to modify or discontinue services at any time.',
				es: 'Nuestra plataforma proporciona gestión de tickets, videoconferencias, colaboración en tiempo real y herramientas organizacionales para equipos. Nos reservamos el derecho de modificar o discontinuar servicios en cualquier momento.',
			}),
		},
		userResponsibilities: {
			title: t({
				en: 'User Responsibilities',
				es: 'Responsabilidades del Usuario',
			}),
			content: t({
				en: 'You are responsible for maintaining the confidentiality of your account, ensuring appropriate use of the platform, and complying with all applicable laws and regulations.',
				es: 'Eres responsable de mantener la confidencialidad de tu cuenta, garantizar el uso apropiado de la plataforma y cumplir con todas las leyes y regulaciones aplicables.',
			}),
		},
		prohibitedUses: {
			title: t({
				en: 'Prohibited Uses',
				es: 'Usos Prohibidos',
			}),
			content: t({
				en: 'You may not use the platform for illegal activities, harassment, spam, or any activities that could harm the platform or other users. Violations may result in account termination.',
				es: 'No puedes usar la plataforma para actividades ilegales, acoso, spam o cualquier actividad que pueda dañar la plataforma u otros usuarios. Las violaciones pueden resultar en la terminación de la cuenta.',
			}),
		},
		intellectualProperty: {
			title: t({
				en: 'Intellectual Property',
				es: 'Propiedad Intelectual',
			}),
			content: t({
				en: 'All content, features, and functionality of the platform are owned by us and are protected by copyright, trademark, and other intellectual property laws.',
				es: 'Todo el contenido, características y funcionalidad de la plataforma son propiedad nuestra y están protegidos por derechos de autor, marcas registradas y otras leyes de propiedad intelectual.',
			}),
		},
		limitation: {
			title: t({
				en: 'Limitation of Liability',
				es: 'Limitación de Responsabilidad',
			}),
			content: t({
				en: 'We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability is limited to the amount paid by you in the last 12 months.',
				es: 'No somos responsables de ningún daño indirecto, incidental, especial o consecuente que surja de tu uso de la plataforma. Nuestra responsabilidad total está limitada a la cantidad pagada por ti en los últimos 12 meses.',
			}),
		},
		termination: {
			title: t({
				en: 'Termination',
				es: 'Terminación',
			}),
			content: t({
				en: 'We may terminate or suspend your access to the platform at any time, with or without cause or notice. Upon termination, your right to use the platform will immediately cease.',
				es: 'Podemos terminar o suspender tu acceso a la plataforma en cualquier momento, con o sin causa o aviso. Al terminar, tu derecho a usar la plataforma cesará inmediatamente.',
			}),
		},
		changes: {
			title: t({
				en: 'Changes to Terms',
				es: 'Cambios a los Términos',
			}),
			content: t({
				en: 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.',
				es: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuo de la plataforma después de los cambios constituye la aceptación de los nuevos términos.',
			}),
		},
	},
} satisfies Dictionary;

export default termsContent;
