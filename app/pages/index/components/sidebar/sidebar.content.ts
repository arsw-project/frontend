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
		organizations: t({
			en: 'Organizations',
			es: 'Organizaciones',
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
		menu: t({
			en: 'Menu',
			es: 'Menú',
		}),
		app: t({
			en: 'App',
			es: 'Aplicación',
		}),
	},
} satisfies Dictionary;

export default sidebarContent;
