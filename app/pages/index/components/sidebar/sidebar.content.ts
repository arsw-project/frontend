import { type Dictionary, t } from 'intlayer';

const sidebarContent = {
	key: 'sidebar',
	content: {
		dashboard: t({
			en: 'Dashboard',
			es: 'Panel de Control',
		}),
		members: t({
			en: 'Members',
			es: 'Miembros',
		}),
		board: t({
			en: 'Board',
			es: 'Tablero',
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
