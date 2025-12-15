import { type Dictionary, t } from 'intlayer';

const supportContent = {
	key: 'support',
	content: {
		title: t({
			en: 'Support Center',
			es: 'Centro de Soporte',
		}),
		subtitle: t({
			en: 'How can we help you today?',
			es: '¿Cómo podemos ayudarte hoy?',
		}),
		backToHome: t({
			en: 'Back to home',
			es: 'Volver al inicio',
		}),
		faq: {
			title: t({
				en: 'Frequently Asked Questions',
				es: 'Preguntas Frecuentes',
			}),
			question1: {
				q: t({
					en: 'How do I create a new ticket?',
					es: '¿Cómo creo un nuevo ticket?',
				}),
				a: t({
					en: 'Navigate to the Board page and click the "New Ticket" button. Fill in the required information including title, description, priority, and assignee.',
					es: 'Navega a la página de Tablero y haz clic en el botón "Nuevo Ticket". Completa la información requerida incluyendo título, descripción, prioridad y asignatario.',
				}),
			},
			question2: {
				q: t({
					en: 'How do I join a video call?',
					es: '¿Cómo me uno a una videollamada?',
				}),
				a: t({
					en: 'Open a ticket and click the "Join Call" button. Grant camera and microphone permissions when prompted. You can also share your screen during the call.',
					es: 'Abre un ticket y haz clic en el botón "Unirse a la llamada". Otorga permisos de cámara y micrófono cuando se solicite. También puedes compartir tu pantalla durante la llamada.',
				}),
			},
			question3: {
				q: t({
					en: 'How do I invite team members?',
					es: '¿Cómo invito a miembros del equipo?',
				}),
				a: t({
					en: 'Go to the Members page and click "Invite Member". Enter their email address and select their role. They will receive an invitation email.',
					es: 'Ve a la página de Miembros y haz clic en "Invitar Miembro". Ingresa su dirección de correo electrónico y selecciona su rol. Recibirán un correo de invitación.',
				}),
			},
			question4: {
				q: t({
					en: 'Can I change my organization settings?',
					es: '¿Puedo cambiar la configuración de mi organización?',
				}),
				a: t({
					en: 'Yes, administrators can modify organization settings from the Organizations page. This includes name, description, and member permissions.',
					es: 'Sí, los administradores pueden modificar la configuración de la organización desde la página de Organizaciones. Esto incluye nombre, descripción y permisos de miembros.',
				}),
			},
		},
		contact: {
			title: t({
				en: 'Contact Support',
				es: 'Contactar Soporte',
			}),
			description: t({
				en: 'Need more help? Get in touch with our support team',
				es: '¿Necesitas más ayuda? Contacta a nuestro equipo de soporte',
			}),
			email: {
				label: t({
					en: 'Email',
					es: 'Correo electrónico',
				}),
				value: 'support@ticketmanager.com',
			},
			hours: {
				label: t({
					en: 'Support Hours',
					es: 'Horario de Soporte',
				}),
				value: t({
					en: 'Monday - Friday, 9:00 AM - 6:00 PM EST',
					es: 'Lunes - Viernes, 9:00 AM - 6:00 PM EST',
				}),
			},
			response: {
				label: t({
					en: 'Response Time',
					es: 'Tiempo de Respuesta',
				}),
				value: t({
					en: 'Usually within 24 hours',
					es: 'Usualmente dentro de 24 horas',
				}),
			},
		},
		resources: {
			title: t({
				en: 'Additional Resources',
				es: 'Recursos Adicionales',
			}),
			documentation: {
				title: t({
					en: 'Documentation',
					es: 'Documentación',
				}),
				description: t({
					en: 'Detailed guides and API references',
					es: 'Guías detalladas y referencias de API',
				}),
			},
			community: {
				title: t({
					en: 'Community Forum',
					es: 'Foro de Comunidad',
				}),
				description: t({
					en: 'Connect with other users and share tips',
					es: 'Conéctate con otros usuarios y comparte consejos',
				}),
			},
			status: {
				title: t({
					en: 'System Status',
					es: 'Estado del Sistema',
				}),
				description: t({
					en: 'Check platform uptime and incidents',
					es: 'Verifica el tiempo de actividad e incidentes',
				}),
			},
		},
	},
} satisfies Dictionary;

export default supportContent;
