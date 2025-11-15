import { type Dictionary, t } from 'intlayer';

const sidebarContent = {
	key: 'sidebar',
	content: {
		home: t({
			en: 'Home',
			es: 'Inicio',
		}),
		notifications: t({
			en: 'Notifications',
			es: 'Notificaciones',
		}),
		settings: t({
			en: 'Settings',
			es: 'Configuración',
		}),
		signOut: t({
			en: 'Sign Out',
			es: 'Cerrar Sesión',
		}),
	},
} satisfies Dictionary;

export default sidebarContent;
