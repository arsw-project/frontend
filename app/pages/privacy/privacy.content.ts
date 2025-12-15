import { type Dictionary, t } from 'intlayer';

const privacyContent = {
	key: 'privacy',
	content: {
		title: t({
			en: 'Privacy Policy',
			es: 'Política de Privacidad',
		}),
		lastUpdated: t({
			en: 'Last updated',
			es: 'Última actualización',
		}),
		backToHome: t({
			en: 'Back to home',
			es: 'Volver al inicio',
		}),
		introduction: {
			title: t({
				en: 'Introduction',
				es: 'Introducción',
			}),
			content: t({
				en: 'This Privacy Policy describes how we collect, use, and protect your personal information when you use our ticket management platform.',
				es: 'Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestra plataforma de gestión de tickets.',
			}),
		},
		dataCollection: {
			title: t({
				en: 'Information We Collect',
				es: 'Información que Recopilamos',
			}),
			content: t({
				en: 'We collect information you provide directly, such as your name, email, organization details, and ticket information. We also collect usage data, including IP addresses, browser type, and activity logs.',
				es: 'Recopilamos información que proporcionas directamente, como tu nombre, correo electrónico, detalles de organización e información de tickets. También recopilamos datos de uso, incluyendo direcciones IP, tipo de navegador y registros de actividad.',
			}),
		},
		dataUsage: {
			title: t({
				en: 'How We Use Your Information',
				es: 'Cómo Usamos tu Información',
			}),
			content: t({
				en: 'We use your information to provide and improve our services, communicate with you, ensure platform security, and comply with legal obligations.',
				es: 'Usamos tu información para proporcionar y mejorar nuestros servicios, comunicarnos contigo, garantizar la seguridad de la plataforma y cumplir con obligaciones legales.',
			}),
		},
		dataProtection: {
			title: t({
				en: 'Data Protection',
				es: 'Protección de Datos',
			}),
			content: t({
				en: 'We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.',
				es: 'Implementamos medidas de seguridad estándar de la industria para proteger tus datos, incluyendo encriptación, servidores seguros y auditorías de seguridad regulares.',
			}),
		},
		userRights: {
			title: t({
				en: 'Your Rights',
				es: 'Tus Derechos',
			}),
			content: t({
				en: 'You have the right to access, modify, or delete your personal information. You can also request a copy of your data or withdraw consent at any time.',
				es: 'Tienes derecho a acceder, modificar o eliminar tu información personal. También puedes solicitar una copia de tus datos o retirar el consentimiento en cualquier momento.',
			}),
		},
		contact: {
			title: t({
				en: 'Contact Us',
				es: 'Contáctanos',
			}),
			content: t({
				en: 'If you have questions about this Privacy Policy, please contact us at privacy@ticketmanager.com',
				es: 'Si tienes preguntas sobre esta Política de Privacidad, contáctanos en privacy@ticketmanager.com',
			}),
		},
	},
} satisfies Dictionary;

export default privacyContent;
