import { type Dictionary, t } from 'intlayer';

const permissionWrapperContent = {
	key: 'permission-wrapper',
	content: {
		accessDenied: t({
			en: 'Access denied',
			es: 'Acceso denegado',
		}),
		insufficientPermissions: t({
			en: 'You do not have the necessary permissions to view this content',
			es: 'No tienes los permisos necesarios para ver este contenido',
		}),
		errorLoadingSession: t({
			en: 'Error loading session information',
			es: 'Error al cargar la información de la sesión',
		}),
	},
} satisfies Dictionary;

export default permissionWrapperContent;
