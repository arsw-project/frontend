import { type Dictionary, t } from 'intlayer';

const appContent = {
	key: 'index',
	content: {
		title: t({
			en: 'ARSW Project',
			es: 'Proyecto ARSW',
		}),
		welcome: t({
			en: 'Welcome',
			es: 'Bienvenido',
		}),
		logout: t({
			en: 'Sign Out',
			es: 'Cerrar Sesión',
		}),
		sessionInfo: t({
			en: 'Session Information',
			es: 'Información de Sesión',
		}),
		currentAccountData: t({
			en: 'Current account data:',
			es: 'Datos de cuenta actuales:',
		}),
		yourSessionIn: t({
			en: 'This is your session in ARSW Project',
			es: 'Esta es tu sesión en el Proyecto ARSW',
		}),
	},
} satisfies Dictionary;

export default appContent;
