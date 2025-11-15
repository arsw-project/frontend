import { type Dictionary, t } from 'intlayer';

const appLoadingContent = {
	key: 'app-loading',
	content: {
		loadingText: t({
			en: 'Loading application...',
			es: 'Cargando aplicación...',
		}),
	},
} satisfies Dictionary;

export default appLoadingContent;
