import { type DeclarationContent, t } from 'intlayer';

const settingsContent = {
	key: 'settings',
	content: {
		title: t({
			en: 'Settings',
			es: 'Configuración',
		}),
		profile: {
			title: t({
				en: 'Profile',
				es: 'Perfil',
			}),
		},
		notifications: {
			title: t({
				en: 'Notifications',
				es: 'Notificaciones',
			}),
		},
		appearance: {
			title: t({
				en: 'Appearance',
				es: 'Apariencia',
			}),
		},
		security: {
			title: t({
				en: 'Security',
				es: 'Seguridad',
			}),
		},
	},
} satisfies DeclarationContent;

export default settingsContent;
