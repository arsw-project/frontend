import { type Dictionary, t } from 'intlayer';

const notificationsMenuContent = {
	key: 'notifications_menu',
	content: {
		title: t({
			en: 'Notifications',
			es: 'Notificaciones',
		}),
		markAllAsRead: t({
			en: 'Mark all as read',
			es: 'Marcar todo como leído',
		}),
		viewAll: t({
			en: 'View all',
			es: 'Ver todas',
		}),
		noNotifications: t({
			en: 'No notifications',
			es: 'Sin notificaciones',
		}),
		noNotificationsDescription: t({
			en: "You're all caught up!",
			es: '¡Estás al día!',
		}),
		newTicketAssigned: t({
			en: 'assigned you a new ticket',
			es: 'te asignó un nuevo ticket',
		}),
		ticketStatusChanged: t({
			en: 'changed ticket status to',
			es: 'cambió el estado del ticket a',
		}),
		ticketCommented: t({
			en: 'commented on ticket',
			es: 'comentó en el ticket',
		}),
		videoCallStarted: t({
			en: 'started a video call for',
			es: 'inició una videollamada para',
		}),
		mentionedYou: t({
			en: 'mentioned you in',
			es: 'te mencionó en',
		}),
		ticketCompleted: t({
			en: 'marked ticket as completed',
			es: 'marcó el ticket como completado',
		}),
		newMemberAdded: t({
			en: 'added a new member to',
			es: 'agregó un nuevo miembro a',
		}),
		justNow: t({
			en: 'Just now',
			es: 'Ahora mismo',
		}),
		minutesAgo: t({
			en: 'minutes ago',
			es: 'minutos',
		}),
		hoursAgo: t({
			en: 'hours ago',
			es: 'horas',
		}),
		daysAgo: t({
			en: 'days ago',
			es: 'días',
		}),
	},
} satisfies Dictionary;

export default notificationsMenuContent;
